/**
 * StudyBuddy Stats - Focus, Mood, Burnout tracking
 * Hybrid: self-report (mood) + behavior (focus) + pattern (burnout)
 */

const STATS_KEY = 'user_stats';

function getStats() {
    try {
        const raw = localStorage.getItem(STATS_KEY);
        return raw ? JSON.parse(raw) : {
            mood_entries: [],
            burnoutScore: 0,
            lastBurnoutUpdate: new Date().toISOString().slice(0,10),
            dailyFocus: { date: new Date().toISOString().slice(0,10), sessions:0, exits:0, distractions:0 }
        };
    } catch (e) {
        return { mood_entries: [], burnoutScore:0, lastBurnoutUpdate:'', dailyFocus:{} };
    }
}

function saveStats(stats) {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

// ---------- Focus (daily) ----------
function ensureDailyFocus() {
    const stats = getStats();
    const today = new Date().toISOString().slice(0,10);
    if (!stats.dailyFocus || stats.dailyFocus.date !== today) {
        stats.dailyFocus = { date: today, sessions:0, exits:0, distractions:0 };
        saveStats(stats);
    }
    return stats.dailyFocus;
}

function getFocusScore() {
    const daily = ensureDailyFocus();
    let score = 50 + daily.sessions*10 - daily.exits*5 - daily.distractions*3;
    return Math.max(0, Math.min(100, score));
}

function recordSessionCompleted(durationMinutes) {
    const stats = getStats();                     // get current stats once
    applyBurnoutDecay(stats);                      // decay before updating

    // Ensure dailyFocus exists for today
    const today = new Date().toISOString().slice(0,10);
    if (!stats.dailyFocus || stats.dailyFocus.date !== today) {
        stats.dailyFocus = { date: today, sessions:0, exits:0, distractions:0 };
    }
    stats.dailyFocus.sessions++;                   // increment sessions

    // Burnout increase based on duration
    let increase = 0;
    if (durationMinutes <= 10) increase = 2;       // short
    else if (durationMinutes <= 20) increase = 5;  // average
    else increase = 10;                             // deep

    stats.burnoutScore = (stats.burnoutScore || 0) + increase;
    stats.lastBurnoutUpdate = today;
    saveStats(stats);                               // save once
}

function recordEarlyExit() {
    const stats = getStats();
    const today = new Date().toISOString().slice(0,10);
    if (!stats.dailyFocus || stats.dailyFocus.date !== today) {
        stats.dailyFocus = { date: today, sessions:0, exits:0, distractions:0 };
    }
    stats.dailyFocus.exits++;
    saveStats(stats);
}

function recordDistraction() {
    const stats = getStats();
    const today = new Date().toISOString().slice(0,10);
    if (!stats.dailyFocus || stats.dailyFocus.date !== today) {
        stats.dailyFocus = { date: today, sessions:0, exits:0, distractions:0 };
    }
    stats.dailyFocus.distractions++;
    saveStats(stats);
}

function recordBreakSkipped() {
    const stats = getStats();
    stats.breaks_skipped = (stats.breaks_skipped || 0) + 1;
    saveStats(stats);
}

// ---------- Burnout (with daily decay) ----------
function applyBurnoutDecay(stats) {
    const today = new Date().toISOString().slice(0,10);
    const last = stats.lastBurnoutUpdate || today;
    if (last < today) {
        const daysDiff = Math.floor((new Date(today) - new Date(last)) / (1000*60*60*24));
        if (daysDiff > 0) {
            let burnout = stats.burnoutScore || 0;
            for (let i=0; i<daysDiff; i++) {
                burnout = burnout * 0.9; // 10% decay per day
            }
            stats.burnoutScore = Math.round(burnout);
            stats.lastBurnoutUpdate = today;
        }
    }
}

function getBurnoutScore() {
    const stats = getStats();
    applyBurnoutDecay(stats);
    saveStats(stats); // persist decayed value
    return stats.burnoutScore || 0;
}

function recordBrainFogUsed() {
    const stats = getStats();
    applyBurnoutDecay(stats);
    stats.burnoutScore = Math.max(0, (stats.burnoutScore || 0) - 10);
    stats.lastBurnoutUpdate = new Date().toISOString().slice(0,10);
    saveStats(stats);
}

// ---------- Mood (once per day, keep last 7) ----------
function addMoodEntry(value, note) {
    const stats = getStats();
    const today = new Date().toISOString().slice(0,10);
    // Remove any existing entry for today
    stats.mood_entries = (stats.mood_entries || []).filter(e => e.date !== today);
    stats.mood_entries.push({ value, note: note || '', date: today });
    // Keep only last 30 days (but Insights will show last 7)
    if (stats.mood_entries.length > 30) stats.mood_entries = stats.mood_entries.slice(-30);
    saveStats(stats);
}

function hasMoodToday() {
    const stats = getStats();
    const today = new Date().toISOString().slice(0,10);
    return (stats.mood_entries || []).some(e => e.date === today);
}

function getRecentMoods(days = 7) {
    const stats = getStats();
    const entries = stats.mood_entries || [];
    // Sort by date descending, take last `days`
    return entries.sort((a,b) => b.date.localeCompare(a.date)).slice(0, days);
}

// ---------- Labels ----------
function getFocusLabel(score) {
    if (score >= 70) return 'High';
    if (score >= 40) return 'Moderate';
    return 'Low';
}
function getBurnoutLabel(score) {
    if (score <= 30) return 'Low';
    if (score <= 60) return 'Moderate';
    return 'High';
}
function getMoodLabel(score) {
    if (score === null) return '—';
    if (score >= 66) return 'Good';
    if (score >= 33) return 'Okay';
    return 'Bad';
}
function getMoodScore() {
    const stats = getStats();
    const today = new Date().toISOString().slice(0,10);
    const todayEntry = (stats.mood_entries || []).find(e => e.date === today);
    if (!todayEntry) return null;
    return Math.round((todayEntry.value / 3) * 100);
}

// Smart Start suggestions (unchanged)
function getSmartSuggestion() {
    const mood = getMoodScore();
    const focus = getFocusScore();
    const burnout = getBurnoutScore();
    const moodLabel = getMoodLabel(mood);
    const burnoutLabel = getBurnoutLabel(burnout);

    if (moodLabel === 'Bad' || burnoutLabel === 'High' || burnoutLabel === 'Moderate') {
        return { type: 'easy', message: 'Try a lighter task today.' };
    }
    if (getFocusLabel(focus) === 'High') {
        return { type: 'harder', message: 'You\'re on fire — tackle something challenging.' };
    }
    return { type: 'normal', message: null };
}

function shouldSuggestBrainFog() {
    const focus = getFocusScore();
    const stats = getStats();
    const recentExits = stats.early_exits || 0;
    return focus < 40 || recentExits > 0;
}

function getRecommendedSingleMinutes() {
    const burnout = getBurnoutScore();
    const focus = getFocusScore();
    const bLabel = getBurnoutLabel(burnout);
    const fLabel = getFocusLabel(focus);
    if (bLabel === 'High') return 5;
    if (bLabel === 'Moderate') return 8;
    if (fLabel === 'High') return 15;
    return 10;
}

function getRecommendedPomodoroSettings() {
    const burnout = getBurnoutScore();
    const focus = getFocusScore();
    const bLabel = getBurnoutLabel(burnout);
    const fLabel = getFocusLabel(focus);
    let focusMin = 25, breakMin = 5, longBreakMin = 20, sessionsBeforeLong = 4;
    if (bLabel === 'High') { focusMin = 15; breakMin = 5; longBreakMin = 15; }
    else if (bLabel === 'Moderate') { focusMin = 20; breakMin = 5; longBreakMin = 18; }
    else if (fLabel === 'High') { focusMin = 30; breakMin = 5; longBreakMin = 25; }
    return { focusMin, breakMin, longBreakMin, sessionsBeforeLong };
}

// ========== Adaptive Timer Recommendations (with Load) ==========

/**
 * Get recommended single focus duration based on burnout, focus, and task load.
 * Returns: 'short', 'average', or 'deep'
 */
function getRecommendedSingleMode(burnout, focus, load) {
    // Priority: burnout > focus > load
    if (burnout >= 61) return 'short';                     // High burnout

    if (burnout >= 31) {                                   // Moderate burnout
        if (focus >= 70) {
            return load === 'light' ? 'deep' : 'average';
        } else if (focus >= 40) {
            return 'average';
        } else { // low focus
            return load === 'light' ? 'average' : 'short';
        }
    }

    // Low burnout
    if (focus >= 70) {
        return load === 'heavy' ? 'average' : 'deep';
    } else if (focus >= 40) {
        if (load === 'light') return 'deep';
        if (load === 'medium') return 'average';
        return 'short'; // heavy
    } else { // low focus
        return load === 'light' ? 'average' : 'short';
    }
}

/**
 * Get recommended Pomodoro settings based on burnout, focus, and task load.
 * Returns: { focusMin, breakMin, longBreakMin, sessions }
 */
function getRecommendedPomodoro(burnout, focus, load) {
    let focusMin = 25, breakMin = 5, longBreakMin = 20, sessions = 4;

    // 1. Apply burnout modifier (highest priority)
    if (burnout >= 61) {               // High burnout
        focusMin = Math.max(15, Math.round(focusMin * 0.7));
        breakMin = Math.min(10, Math.round(breakMin * 1.2));
        longBreakMin = Math.min(30, Math.round(longBreakMin * 1.2));
        sessions = Math.max(2, sessions - 1);
    } else if (burnout >= 31) {         // Moderate burnout – no change
        // keep base
    } else {                             // Low burnout
        focusMin = Math.min(40, Math.round(focusMin * 1.2));
        longBreakMin = Math.min(30, Math.round(longBreakMin * 1.2));
    }

    // 2. Apply focus modifier
    if (focus >= 70) {                   // High focus
        focusMin = Math.min(45, Math.round(focusMin * 1.1));
        breakMin = Math.max(3, Math.round(breakMin * 0.9));
    } else if (focus <= 39) {            // Low focus
        focusMin = Math.max(15, Math.round(focusMin * 0.9));
        breakMin = Math.min(10, Math.round(breakMin * 1.1));
    }

    // 3. Apply load modifier (fine‑tuning)
    if (load === 'light') {
        focusMin = Math.min(45, Math.round(focusMin * 1.1));
        breakMin = Math.max(3, Math.round(breakMin * 0.9));
        longBreakMin = Math.max(10, Math.round(longBreakMin * 0.9));
        sessions = Math.min(6, sessions + 1);
    } else if (load === 'heavy') {
        focusMin = Math.max(15, Math.round(focusMin * 0.9));
        breakMin = Math.min(10, Math.round(breakMin * 1.1));
        longBreakMin = Math.min(30, Math.round(longBreakMin * 1.1));
        sessions = Math.max(2, sessions - 1);
    }

    return { focusMin, breakMin, longBreakMin, sessions };
}