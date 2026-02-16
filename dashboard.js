// ==================== Motivation Content Presets ====================
const motivationPresets = {
    questions: [
        "Ready for a challenge?",
        "Want to accomplish something great?",
        "Let's crush your goals today!",
        "Time to level up your productivity?",
        "Are you prepared to succeed?",
        "Ready to make today count?",
        "Feeling motivated to study?",
        "Let's build something amazing!"
    ],
    questionsSmall: [
        "Ready to make today count?",
        "Let's crush your goals?",
        "Want to level up?",
        "Time to succeed?",
        "Let's do this?",
        "Ready to hustle?",
        "Ready to shine?"
    ],
    quotes: [
        { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
        { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
        { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
        { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
    ]
};

const buttonPresets = {
    yes: [
        "Yes! 💪", "Absolutely ✅", "I'm in! 🚀", "Let's go! 🔥", "Count me in 🙌",
        "Heck yes! 🎯", "Bring it on! 💥", "All set ✅", "Game on! 🎮", "On it! ⚡",
        "Let's do this! 🔥", "Forward! ⤴️", "Ready! 👍", "Yes, let's! ✨", "Let's begin 🏁"
    ],
    no: [
        "Not Yet 😴", "Maybe later ⏳", "Need prep ⚙️", "Not today 💤", "In a bit",
        "I'll pass for now 🙃", "Need more coffee ☕", "Not ready ❌", "Give me time 🕰️",
        "Later please 🙏", "I'll prep first 🛠️", "Not quite yet 🤏", "Give me a moment", "Try later 🔁"
    ]
};

let _yesPresetIndex = 0;
let _noPresetIndex = 0;
const ROTATION_INTERVAL = 12;
let smallCalYear = null;
let smallCalMonth = null;

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeMotivation();
    initializeCalendar();
    initializeTodo();
    initializeModals();
    initializeStats();
    startRotation();
    document.getElementById('resetAllBtn')?.addEventListener('click', function() {
        const ok = confirm('Reset all StudyBuddy data (stats, tasks, sessions)? This cannot be undone.');
        if (!ok) return;
        resetAllData();
    });
});

// ==================== Motivation Functions ====================
function initializeMotivation() {
    updateMotivationContent();
    document.getElementById('refreshBtn')?.addEventListener('click', updateMotivationContent);
    restartLoader();
}

function restartLoader() {
    const loaderBar = document.querySelector('.motivation-loader .bar');
    if (!loaderBar) return;
    loaderBar.style.animationDuration = ROTATION_INTERVAL + 's';
    loaderBar.style.animation = 'none';
    loaderBar.offsetHeight;
    loaderBar.style.animation = '';
}

function updateMotivationContent() {
    const quoteIndex = Math.floor(Math.random() * motivationPresets.quotes.length);
    const quote = motivationPresets.quotes[quoteIndex];
    document.getElementById('motivationQuote').textContent = `"${quote.text}"`;
    document.getElementById('quoteAuthor').textContent = `— ${quote.author}`;
    restartLoader();
}

function startRotation() {
    setInterval(updateMotivationContent, ROTATION_INTERVAL * 1000);
}

// ==================== Calendar Functions ====================
function initializeCalendar() {
    const now = new Date();
    smallCalYear = now.getFullYear();
    smallCalMonth = now.getMonth();
    renderCalendar(smallCalYear, smallCalMonth);

    const prevBtn = document.getElementById('prevMonthBtn');
    const nextBtn = document.getElementById('nextMonthBtn');
    const animateSmall = (direction) => {
        const daysEl = document.querySelector('.calendar-days');
        if (!daysEl) return;
        daysEl.classList.remove('anim-in-left','anim-in-right');
        daysEl.classList.add(direction === 'prev' ? 'anim-out-right' : 'anim-out-left');
        setTimeout(()=>{
            if (direction === 'prev') {
                smallCalMonth--;
                if (smallCalMonth < 0) { smallCalMonth = 11; smallCalYear--; }
            } else {
                smallCalMonth++;
                if (smallCalMonth > 11) { smallCalMonth = 0; smallCalYear++; }
            }
            renderCalendar(smallCalYear, smallCalMonth);
            const newDays = document.querySelector('.calendar-days');
            if (newDays) {
                newDays.classList.remove('anim-out-left','anim-out-right');
                newDays.classList.add(direction === 'prev' ? 'anim-in-left' : 'anim-in-right');
            }
        }, 260);
    };
    if (prevBtn) prevBtn.addEventListener('click', () => animateSmall('prev'));
    if (nextBtn) nextBtn.addEventListener('click', () => animateSmall('next'));
}

function renderCalendar(year, month) {
    const calendarGrid = document.getElementById('calendarGrid');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    
    calendarGrid.innerHTML = '';
    document.getElementById('monthDisplay').textContent = `${monthNames[month]} ${year}`;
    
    const monthDiv = document.createElement('div');
    monthDiv.className = 'calendar-month';
    
    const weekdaysDiv = document.createElement('div');
    weekdaysDiv.className = 'calendar-weekdays';
    dayNames.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-weekday';
        dayEl.textContent = day;
        weekdaysDiv.appendChild(dayEl);
    });
    monthDiv.appendChild(weekdaysDiv);
    
    const daysDiv = document.createElement('div');
    daysDiv.className = 'calendar-days';
    
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();
    const today = new Date();
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
    const todayDate = today.getDate();
    
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day other-month';
        dayEl.textContent = prevLastDate - i;
        daysDiv.appendChild(dayEl);
    }
    
    for (let i = 1; i <= lastDate; i++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        const num = document.createElement('div');
        num.className = 'calendar-day-num';
        num.textContent = i;
        dayEl.appendChild(num);
        
        const yearStr = String(year).padStart(4,'0');
        const monthStr = String(month+1).padStart(2,'0');
        const dayStr = String(i).padStart(2,'0');
        const dateKey = `${yearStr}-${monthStr}-${dayStr}`;
        try {
            const raw = localStorage.getItem('calendarTasks');
            const obj = raw ? JSON.parse(raw) : {};
            const tasks = obj[dateKey] || [];
            if (tasks.length > 0) dayEl.classList.add('has-task');
        } catch (e) {}
        
        if (isCurrentMonth && i === todayDate) dayEl.classList.add('today');
        daysDiv.appendChild(dayEl);
    }
    
    const totalCells = firstDay + lastDate;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remainingCells; i++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day other-month';
        dayEl.textContent = i;
        daysDiv.appendChild(dayEl);
    }
    
    monthDiv.appendChild(daysDiv);
    calendarGrid.appendChild(monthDiv);
}

// ==================== Todo Functions ====================
function initializeTodo() {
    const addBtn = document.getElementById('addTodoBtn');
    if (addBtn) {
        addBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openAddTaskModal();
        });
    }
    
    const todoListEl = document.getElementById('todoList');
    if (!todoListEl) return;
    todoListEl.innerHTML = '';
    const raw = localStorage.getItem('todoItems');
    const items = raw ? JSON.parse(raw) : [];
    items.forEach((item, idx) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `\n                <div class="todo-left">\n                    <span class="todo-title">${item.title}</span>\n                    ${item.date ? '<span class="todo-date"> — ' + item.date + '</span>' : ''}\n                </div>\n                <div class="todo-actions">\n                    <button class="btn-finish">${item.completed ? '✔ Finished' : 'Mark as finished'}</button>\n                    <button class="btn-delete">🗑️</button>\n                </div>\n            `;
        todoListEl.appendChild(li);

        li.querySelector('.btn-finish').addEventListener('click', function() {
            if (item.completed) return;
            const ok = confirm('Are you sure you want to mark this task as finished?');
            if (!ok) return;
            items[idx].completed = true;
            localStorage.setItem('todoItems', JSON.stringify(items));
            initializeTodo();
        });

        li.querySelector('.btn-delete').addEventListener('click', function() {
            const ok = confirm('Delete this task?');
            if (!ok) return;
            items.splice(idx, 1);
            localStorage.setItem('todoItems', JSON.stringify(items));
            initializeTodo();
        });
    });
}

// ==================== Stats (Focus, Mood, Burnout) ====================
function initializeStats() {
    if (typeof hasMoodToday !== 'function' || typeof addMoodEntry !== 'function') return;

    const moodModal = document.getElementById('moodModal');
    const moodNote = document.getElementById('moodNote');

    if (!hasMoodToday() && moodModal) {
        moodModal.classList.add('show');
        moodModal.setAttribute('aria-hidden', 'false');
    }

    moodModal?.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const value = parseInt(this.dataset.value, 10);
            const note = moodNote ? moodNote.value.trim() : '';
            addMoodEntry(value, note);
            moodModal.classList.remove('show');
            moodModal.setAttribute('aria-hidden', 'true');
            if (moodNote) moodNote.value = '';
            updateStateBar();
        });
    });
    moodModal?.addEventListener('click', (e) => {
        if (e.target === moodModal) {
            moodModal.classList.remove('show');
            moodModal.setAttribute('aria-hidden', 'true');
        }
    });

    updateStateBar();

    // Click mood label to open modal ONLY if no mood today
    const moodLabelEl = document.getElementById('moodLabel');
    if (moodLabelEl && moodModal) {
        moodLabelEl.closest('.state-item')?.addEventListener('click', () => {
            if (!hasMoodToday()) {
                moodModal.classList.add('show');
                moodModal.setAttribute('aria-hidden', 'false');
            } else {
                alert('You already logged your mood today.');
            }
        });
    }
}

function updateStateBar() {
    if (typeof getFocusScore !== 'function' || typeof getMoodScore !== 'function' || typeof getBurnoutScore !== 'function') return;
    if (typeof getFocusLabel !== 'function' || typeof getMoodLabel !== 'function' || typeof getBurnoutLabel !== 'function') return;

    const focusScore = getFocusScore();
    const moodScore = getMoodScore();
    const burnoutScore = getBurnoutScore();

    const focusLabel = getFocusLabel(focusScore);
    const moodLabel = getMoodLabel(moodScore);
    const burnoutLabel = getBurnoutLabel(burnoutScore);

    const barFilled = Math.round((focusScore / 100) * 8);
    const barEmpty = 8 - barFilled;
    const focusBarStr = '█'.repeat(barFilled) + '░'.repeat(barEmpty);

    const fl = document.getElementById('focusLabel');
    const ml = document.getElementById('moodLabel');
    const bl = document.getElementById('burnoutLabel');
    // FIX: Show numeric scores
    if (fl) fl.textContent = focusLabel + ' (' + focusScore + ')';
    if (ml) {
        const moodEmoji = moodLabel === 'Good' ? '😄' : moodLabel === 'Okay' ? '😐' : moodLabel === 'Bad' ? '😞' : '';
        ml.textContent = (moodEmoji ? moodEmoji + ' ' : '') + moodLabel;
    }
    if (bl) bl.textContent = burnoutLabel + ' (' + burnoutScore + ')';
    document.querySelectorAll('.focus-bar').forEach(el => { el.textContent = focusBarStr; });

    const alertEl = document.getElementById('burnoutAlert');
    if (alertEl) {
        alertEl.style.display = (burnoutScore >= 31) ? 'block' : 'none';
        if (burnoutScore >= 31) {
            alertEl.textContent = burnoutScore >= 61
                ? '⚠️ You might be getting tired. Try a lighter task.'
                : '⚠️ You\'ve studied a lot. Try a light task.';
        }
    }

    // Update trend indicators
    try {
        const pushHistory = (key, value) => {
            const raw = localStorage.getItem(key);
            const arr = raw ? JSON.parse(raw) : [];
            if (arr.length === 0 || arr[arr.length - 1] !== value) arr.push(value);
            while (arr.length > 10) arr.shift();
            localStorage.setItem(key, JSON.stringify(arr));
            return arr;
        };
        const fHist = pushHistory('focusHistory', focusScore);
        const bHist = pushHistory('burnoutHistory', burnoutScore);
        const fTrendEl = document.getElementById('focusTrend');
        const bTrendEl = document.getElementById('burnoutTrend');
        if (fTrendEl) {
            if (fHist.length >= 2) {
                const prev = fHist[fHist.length - 2], last = fHist[fHist.length - 1];
                fTrendEl.textContent = last > prev ? '▲' : last < prev ? '▼' : '→';
                fTrendEl.title = `Focus: ${prev} → ${last}`;
            } else {
                fTrendEl.textContent = '';
            }
        }
        if (bTrendEl) {
            if (bHist.length >= 2) {
                const prev = bHist[bHist.length - 2], last = bHist[bHist.length - 1];
                bTrendEl.textContent = last > prev ? '▲' : last < prev ? '▼' : '→';
                bTrendEl.title = `Burnout: ${prev} → ${last}`;
            } else {
                bTrendEl.textContent = '';
            }
        }
    } catch (e) {}
}

// Listen to localStorage changes (using string literal to avoid STATS_KEY conflict)
window.addEventListener('storage', (e) => {
    if (e.key === 'user_stats' || e.key === 'focusHistory' || e.key === 'burnoutHistory') {
        updateStateBar();
    }
});

// ==================== Calendar Tasks (for Smart Start) ====================
function getAllCalendarTasks() {
    try {
        const raw = localStorage.getItem('calendarTasks');
        const obj = raw ? JSON.parse(raw) : {};
        const tasks = [];
        for (const dateStr in obj) {
            (obj[dateStr] || []).forEach(t => tasks.push({ ...t, date: dateStr }));
        }
        return tasks;
    } catch (e) { return []; }
}

// ==================== Add Task Modal ====================
function openAddTaskModal(forDate) {
    const modal = document.getElementById('addTaskModal');
    const date = forDate || new Date().toISOString().slice(0, 10);
    document.getElementById('addTaskStart').value = date + 'T09:00';
    document.getElementById('addTaskEnd').value = date + 'T10:00';
    modal?.classList.add('show');
    modal?.setAttribute('aria-hidden', 'false');
}

function closeAddTaskModal() {
    const modal = document.getElementById('addTaskModal');
    modal?.classList.remove('show');
    modal?.setAttribute('aria-hidden', 'true');
    document.getElementById('addTaskTitle').value = '';
    document.getElementById('addTaskDesc').value = '';
}

function saveTaskFromAddModal(dateStr, task) {
    try {
        const raw = localStorage.getItem('calendarTasks');
        const obj = raw ? JSON.parse(raw) : {};
        obj[dateStr] = obj[dateStr] || [];
        obj[dateStr].push(task);
        localStorage.setItem('calendarTasks', JSON.stringify(obj));
        const todos = JSON.parse(localStorage.getItem('todoItems') || '[]');
        todos.push({ title: task.title, date: dateStr, completed: false });
        localStorage.setItem('todoItems', JSON.stringify(todos));
    } catch (e) {}
}

// ==================== Smart Start Helpers ====================
function showStartModalTaskList() {
    const startModal = document.getElementById('startSessionModal');
    const noTasks = document.getElementById('smartStartNoTasks');
    const taskList = document.getElementById('smartStartTaskList');
    const timerStep = document.getElementById('smartStartTimerStep');
    const backBtn = document.getElementById('smartStartBack');
    const container = document.getElementById('taskListContainer');
    const tasks = getAllCalendarTasks();

    noTasks.style.display = 'none';
    taskList.style.display = 'block';
    timerStep.style.display = 'none';
    backBtn.style.display = 'none';

    if (tasks.length === 0) {
        noTasks.style.display = 'block';
        taskList.style.display = 'none';
    } else {
        container.innerHTML = '';
        tasks.forEach((t, i) => {
            const div = document.createElement('div');
            div.className = 'task-list-item';
            div.dataset.index = i;
            div.textContent = t.title + (t.date ? ' — ' + t.date : '');
            div.addEventListener('click', () => {
                container.querySelectorAll('.task-list-item').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                startModal._chosenTask = t;
                document.getElementById('chosenTaskDisplay').textContent = '📘 ' + t.title;
                document.getElementById('smartStartTaskList').style.display = 'none';
                document.getElementById('smartStartTimerStep').style.display = 'block';
                document.getElementById('smartStartBack').style.display = 'inline-block';
                updateSingleSuggestion();
                updatePomoHint();
            });
            container.appendChild(div);
        });
    }
}

function updateSingleSuggestion() {
    const focus = getFocusScore();
    const burnout = getBurnoutScore();
    const focusLabel = getFocusLabel(focus);
    const burnoutLabel = getBurnoutLabel(burnout);
    const suggestionEl = document.getElementById('singleSuggestion');
    if (!suggestionEl) return;
    if (focusLabel === 'High' && burnoutLabel === 'Low') {
        suggestionEl.textContent = 'You\'re highly focused! Try deep mode.';
    } else if (focusLabel === 'Low' && (burnoutLabel === 'High' || burnoutLabel === 'Moderate')) {
        suggestionEl.textContent = 'You seem tired. Try using "Clear Brain" or a short session.';
    } else {
        suggestionEl.textContent = '';
    }
}

function updatePomoHint() {
    const hintEl = document.getElementById('pomoHint');
    if (hintEl) hintEl.textContent = 'Changed based on your focus';
}

// ==================== Modals ====================
function initializeModals() {
    const startModal = document.getElementById('startSessionModal');
    const startBtn = document.getElementById('startSessionBtn');
    const addTaskModal = document.getElementById('addTaskModal');
    const brainFogModal = document.getElementById('brainFogModal');
    const clearBrainBtn = document.getElementById('clearBrainBtn');
    const quickChallengeModal = document.getElementById('quickChallengeModal');
    const quickChallengeBtn = document.getElementById('quickChallengeBtn');
    const studyBuddyModal = document.getElementById('studyBuddyModal');
    const studyBuddyBtn = document.getElementById('studyBuddyBtn');

    const openModal = (modal) => {
        if (modal) { modal.classList.add('show'); modal.setAttribute('aria-hidden', 'false'); }
    };
    const closeModal = (modal) => {
        if (modal) { modal.classList.remove('show'); modal.setAttribute('aria-hidden', 'true'); }
    };

    // Smart Start flow
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            openModal(startModal);
            showStartModalTaskList();
        });
    }

    document.getElementById('addTaskFromSmartStart')?.addEventListener('click', () => {
        closeModal(startModal);
        openAddTaskModal();
    });

    document.querySelectorAll('input[name="sessionType"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const isPomo = document.querySelector('input[name="sessionType"]:checked')?.value === 'pomodoro';
            document.getElementById('singleSettings').style.display = isPomo ? 'none' : 'flex';
            document.getElementById('pomodoroSettings').style.display = isPomo ? 'flex' : 'none';
            if (!isPomo) {
                updateSingleSuggestion();
            }
            if (isPomo) {
                const s = getRecommendedPomodoroSettings();
                document.getElementById('pomoFocus').value = s.focusMin;
                document.getElementById('pomoBreak').value = s.breakMin;
                document.getElementById('pomoLongBreak').value = s.longBreakMin;
                document.getElementById('pomoSessions').value = s.sessionsBeforeLong;
                updatePomoHint();
            }
        });
    });

    document.getElementById('taskListContainer')?.addEventListener('click', (e) => {
        const item = e.target.closest('.task-list-item');
        if (item) {
            const tasks = getAllCalendarTasks();
            const idx = parseInt(item.dataset.index, 10);
            const t = tasks[idx];
            if (t) {
                startModal._chosenTask = t;
                document.getElementById('chosenTaskDisplay').textContent = '📘 ' + t.title;
                document.getElementById('smartStartTaskList').style.display = 'none';
                document.getElementById('smartStartTimerStep').style.display = 'block';
                document.getElementById('smartStartBack').style.display = 'inline-block';
                const isPomo = document.querySelector('input[name="sessionType"]:checked')?.value === 'pomodoro';
                document.getElementById('singleSettings').style.display = isPomo ? 'none' : 'flex';
                document.getElementById('pomodoroSettings').style.display = isPomo ? 'flex' : 'none';
                if (isPomo) {
                    const s = getRecommendedPomodoroSettings();
                    document.getElementById('pomoFocus').value = s.focusMin;
                    document.getElementById('pomoBreak').value = s.breakMin;
                    document.getElementById('pomoLongBreak').value = s.longBreakMin;
                    document.getElementById('pomoSessions').value = s.sessionsBeforeLong;
                }
                updateSingleSuggestion();
                updatePomoHint();
            }
        }
    });

    document.getElementById('smartStartBack')?.addEventListener('click', () => {
        document.getElementById('smartStartTaskList').style.display = 'block';
        document.getElementById('smartStartTimerStep').style.display = 'none';
        document.getElementById('smartStartBack').style.display = 'none';
    });

    document.getElementById('startGhostBtn')?.addEventListener('click', function() {
        const task = startModal._chosenTask;
        if (!task) return;
        const sessionType = document.querySelector('input[name="sessionType"]:checked')?.value || 'single';
        const chosen = document.querySelector('input[name="startMode"]:checked')?.value || 'ghost';
        const ghostMode = chosen === 'ghost';
        const soundscape = chosen === 'soundscape';
        const params = {
            taskName: task.title,
            sessionType,
            ghostMode: ghostMode,
            soundscape: soundscape
        };
        if (sessionType === 'single') {
            // Read selected radio button value
            const selectedDuration = document.querySelector('input[name="singleDuration"]:checked')?.value;
            params.durationMin = selectedDuration ? parseInt(selectedDuration, 10) : 10;
        } else {
            params.focusMin = parseInt(document.getElementById('pomoFocus').value, 10) || 25;
            params.breakMin = parseInt(document.getElementById('pomoBreak').value, 10) || 5;
            params.longBreakMin = parseInt(document.getElementById('pomoLongBreak').value, 10) || 20;
            params.sessionsBeforeLong = parseInt(document.getElementById('pomoSessions').value, 10) || 4;
        }
        sessionStorage.setItem('ghostSession', JSON.stringify(params));
        closeModal(startModal);
        window.location.href = 'ghost.html';
    });

    startModal?.addEventListener('click', (e) => { if (e.target === startModal) closeModal(startModal); });

    // Add Task modal
    document.getElementById('confirmAddTask')?.addEventListener('click', () => {
        const title = document.getElementById('addTaskTitle')?.value?.trim();
        if (!title) return alert('Please enter a title');
        const startVal = document.getElementById('addTaskStart')?.value || '';
        const dateStr = startVal.slice(0, 10);
        const task = {
            title,
            desc: document.getElementById('addTaskDesc')?.value?.trim() || '',
            start: startVal,
            end: document.getElementById('addTaskEnd')?.value || ''
        };
        saveTaskFromAddModal(dateStr, task);
        closeAddTaskModal();
        initializeTodo();
        if (typeof renderCalendar === 'function') renderCalendar(smallCalYear, smallCalMonth);
        // Reopen start modal with task list
        openModal(startModal);
        showStartModalTaskList();
    });
    document.getElementById('cancelAddTask')?.addEventListener('click', closeAddTaskModal);
    addTaskModal?.addEventListener('click', (e) => { if (e.target === addTaskModal) closeAddTaskModal(); });

    // Brain Fog Cleaner
    if (clearBrainBtn) clearBrainBtn.addEventListener('click', () => openModal(brainFogModal));
    brainFogModal?.addEventListener('click', (e) => { if (e.target === brainFogModal) closeModal(brainFogModal); });

    document.getElementById('brainFogStartTask')?.addEventListener('click', function() {
        if (typeof recordBrainFogUsed === 'function') recordBrainFogUsed();
        updateStateBar(); // refresh dashboard immediately
        closeModal(brainFogModal);
        startBtn?.click();
    });

    if (quickChallengeBtn) quickChallengeBtn.addEventListener('click', () => openModal(quickChallengeModal));
    quickChallengeModal?.addEventListener('click', (e) => { if (e.target === quickChallengeModal) closeModal(quickChallengeModal); });

    const challengeQuestion = document.getElementById('challengeQuestion');
    const challengeTimer = document.getElementById('challengeTimer');
    const challengeStartBtn = document.getElementById('challengeStartBtn');
    const challenges = [
        { q: 'What is the powerhouse of the cell?', a: 'mitochondria' },
        { q: 'What is 7 × 8?', a: '56' },
        { q: 'Name one planet in our solar system.', a: 'earth' }
    ];
    challengeStartBtn?.addEventListener('click', function() {
        const c = challenges[Math.floor(Math.random() * challenges.length)];
        challengeQuestion.textContent = c.q;
        let sec = 60;
        const t = setInterval(() => {
            sec--;
            challengeTimer.textContent = '0:' + sec.toString().padStart(2, '0');
            if (sec <= 0) { clearInterval(t); challengeTimer.textContent = 'Done!'; }
        }, 1000);
    });

    if (studyBuddyBtn) studyBuddyBtn.addEventListener('click', () => openModal(studyBuddyModal));
    studyBuddyModal?.addEventListener('click', (e) => { if (e.target === studyBuddyModal) closeModal(studyBuddyModal); });
    document.getElementById('findBuddyBtn')?.addEventListener('click', () => {
        closeModal(studyBuddyModal);
        alert('Study Buddy coming soon! Match with someone studying now.');
    });
}

function addTodo() {
    const todoList = document.getElementById('todoList');
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `
        <input type="checkbox" class="todo-checkbox">
        <span>New task</span>
    `;
    
    li.querySelector('.todo-checkbox').addEventListener('change', function() {
        // Toggle check
    });
    
    todoList.insertBefore(li, todoList.firstChild);
}

function resetAllData() {
    const keys = ['user_stats','todoItems','calendarTasks','events','focusHistory','burnoutHistory','ghostSession','study_sessions'];
    keys.forEach(k => localStorage.removeItem(k));
    // also reset stats key used by stats.js if different
    localStorage.removeItem('user_stats');
    // re-render UI where possible
    try { initializeTodo(); } catch(e) {}
    try { if (typeof renderCalendar === 'function') renderCalendar(smallCalYear, smallCalMonth); } catch(e) {}
    try { updateStateBar(); } catch(e) {}
    alert('All data reset.');
}