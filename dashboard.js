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

// Global references for add task modal validation
let addTitle, addDesc, addTitleCount, addDescCount, addTitleError, confirmAddBtn;

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', function() {
    // Assign global validation elements
    addTitle = document.getElementById('addTaskTitle');
    addDesc = document.getElementById('addTaskDesc');
    addTitleCount = document.getElementById('addTaskTitleCount');
    addDescCount = document.getElementById('addTaskDescCount');
    addTitleError = document.getElementById('addTaskTitleError');
    confirmAddBtn = document.getElementById('confirmAddTask');

    // Attach validation listeners
    if (addTitle) {
        addTitle.addEventListener('input', validateAddTaskTitle);
    }
    if (addDesc) {
        addDesc.addEventListener('input', () => {
            addDescCount.textContent = addDesc.value.length;
        });
    }

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
        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openAddTaskModal(undefined, 'todo');
        });
    }
    
    const todoListEl = document.getElementById('todoList');
    if (!todoListEl) return;
    todoListEl.innerHTML = '';
    const items = JSON.parse(localStorage.getItem('todoItems') || '[]');
    
    const now = Date.now();
    const filteredItems = items.filter(item => {
        if (item.completed && item.finishedAt) {
            const hoursPassed = (now - item.finishedAt) / (1000 * 60 * 60);
            return hoursPassed < 6;
        }
        return true;
    });

    if (filteredItems.length !== items.length) {
        localStorage.setItem('todoItems', JSON.stringify(filteredItems));
    }

    filteredItems.forEach((item, idx) => {
        const li = document.createElement('li');
        li.className = `todo-item ${item.completed ? 'is-completed' : ''}`;
        li.innerHTML = `
            <div class="todo-left">
                <span class="todo-title">${item.title}</span>
                ${item.date ? '<span class="todo-date"> — ' + item.date + '</span>' : ''}
            </div>
            <div class="todo-actions">
                <button class="btn-finish">${item.completed ? '✔ Finished' : 'Mark as finished'}</button>
                <button class="btn-delete">🗑️</button>
            </div>
        `;
        todoListEl.appendChild(li);

        li.querySelector('.btn-finish').addEventListener('click', () => {
            if (item.completed) return;
            if (!confirm('Mark as finished?')) return;
            
            filteredItems[idx].completed = true;
            filteredItems[idx].finishedAt = Date.now();
            localStorage.setItem('todoItems', JSON.stringify(filteredItems));
            initializeTodo();
        });

        li.querySelector('.btn-delete').addEventListener('click', () => {
            const task = filteredItems[idx];
            const isCompleted = task.completed;
            const message = isCompleted 
                ? 'Remove this completed task now?' 
                : 'This task is not marked as finished yet. Remove now?';
            if (!confirm(message)) return;
            
            const taskToDelete = filteredItems[idx];
            
            filteredItems.splice(idx, 1);
            localStorage.setItem('todoItems', JSON.stringify(filteredItems));

            const calendarData = JSON.parse(localStorage.getItem('calendarTasks') || '{}');
            if (taskToDelete.date && calendarData[taskToDelete.date]) {
                calendarData[taskToDelete.date] = calendarData[taskToDelete.date].filter(t => t.title !== taskToDelete.title);
                if (calendarData[taskToDelete.date].length === 0) delete calendarData[taskToDelete.date];
                localStorage.setItem('calendarTasks', JSON.stringify(calendarData));
            }

            initializeTodo();
            if (typeof renderCalendar === 'function') renderCalendar(smallCalYear, smallCalMonth);
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
function openAddTaskModal(forDate, source = 'todo') {
    const modal = document.getElementById('addTaskModal');
    const date = forDate || new Date().toISOString().slice(0, 10);
    document.getElementById('addTaskStart').value = date + 'T09:00';
    document.getElementById('addTaskEnd').value = date + 'T10:00';

    modal.dataset.source = source;

    document.querySelectorAll('.load-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.load-btn.medium')?.classList.add('active');

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');

    // Reset validation and show error immediately because field is empty
    if (addTitle) {
        addTitle.value = '';
        addTitleCount.textContent = '0';
        addTitleError.style.display = 'block'; // Show error immediately
        confirmAddBtn.disabled = true;
    }
    if (addDesc) {
        addDesc.value = '';
        addDescCount.textContent = '0';
    }
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
        const rawCal = localStorage.getItem('calendarTasks');
        const calObj = rawCal ? JSON.parse(rawCal) : {};
        calObj[dateStr] = calObj[dateStr] || [];
        calObj[dateStr].push(task);
        localStorage.setItem('calendarTasks', JSON.stringify(calObj));

        const todos = JSON.parse(localStorage.getItem('todoItems') || '[]');
        todos.push({
            title: task.title,
            date: dateStr,
            completed: false,
            load: task.load
        });
        localStorage.setItem('todoItems', JSON.stringify(todos));
    } catch (e) {
        console.error('Failed to save task', e);
    }
}

// ==================== Smart Start Helpers ====================
function showStartModalTaskList() {
    const container = document.getElementById('taskListContainer');
    const noTasks = document.getElementById('smartStartNoTasks');
    const items = JSON.parse(localStorage.getItem('todoItems') || '[]');
    const startModal = document.getElementById('startSessionModal');

    const optionsDiv = document.querySelector('.modal-options');
    if (startModal.dataset.fromSidebar === 'true') {
        optionsDiv.style.display = 'none';
    } else {
        optionsDiv.style.display = 'block';
    }

    container.innerHTML = '';

    if (items.length === 0) {
        noTasks.style.display = 'block';
        return;
    }
    noTasks.style.display = 'none';

    const pending = items.filter(t => !t.completed);
    const finished = items.filter(t => t.completed);

    const renderGroup = (list, label, isFinished) => {
        if (list.length === 0) return;

        const header = document.createElement('h4');
        header.className = 'task-group-header';
        header.textContent = label;
        container.appendChild(header);

        list.forEach(task => {
            const div = document.createElement('div');
            div.className = `task-list-item ${isFinished ? 'task-finished' : ''}`;

            const loadIcons = { light: '⚪', medium: '🟡', heavy: '🔴' };
            const loadIcon = loadIcons[task.load] || '🟡';

            div.innerHTML = `
                <span class="load-badge">${loadIcon} ${task.load || 'medium'}</span>
                <span class="task-title-text">${task.title}</span>
            `;

            div.addEventListener('click', () => {
                const startModal = document.getElementById('startSessionModal');
                startModal._chosenTask = task;

                const loadIcons = { light: '⚪', medium: '🟡', heavy: '🔴' };
                const loadIcon = loadIcons[task.load] || '🟡';
                document.getElementById('chosenTaskDisplay').innerHTML = `${loadIcon} ${task.load} · 📘 ${task.title}`;

                document.getElementById('smartStartTaskList').style.display = 'none';
                document.getElementById('smartStartTimerStep').style.display = 'block';
                document.getElementById('smartStartBack').style.display = 'inline-block';

                applyRecommendedSettings(task);
            });

            container.appendChild(div);
        });
    };

    renderGroup(pending, "📌 Active Tasks", false);
    renderGroup(finished, "✅ Recently Finished", true);
}

function applyRecommendedSettings(task) {
    const burnout = getBurnoutScore();
    const focus = getFocusScore();
    const load = task.load || 'medium';

    const recommendedMode = getRecommendedSingleMode(burnout, focus, load);
    const radioMap = { short: '10', average: '20', deep: '30' };
    const radioValue = radioMap[recommendedMode] || '20';
    document.querySelector(`input[name="singleDuration"][value="${radioValue}"]`).checked = true;

    const pomo = getRecommendedPomodoro(burnout, focus, load);
    document.getElementById('pomoFocusValue').textContent = pomo.focusMin;
    document.getElementById('pomoBreakValue').textContent = pomo.breakMin;
    document.getElementById('pomoLongBreakValue').textContent = pomo.longBreakMin;
    document.getElementById('pomoSessionsValue').textContent = pomo.sessions;

    updateSingleSuggestion(load);
}

function updateSingleSuggestion(load) {
    const focus = getFocusScore();
    const burnout = getBurnoutScore();
    const focusLabel = getFocusLabel(focus);
    const burnoutLabel = getBurnoutLabel(burnout);
    const suggestionEl = document.getElementById('singleSuggestion');
    if (!suggestionEl) return;

    let message = '✨ Recommended based on your focus, burnout, and task load.';
    if (focusLabel === 'High' && burnoutLabel === 'Low') {
        message = '🔥 You\'re highly focused! Deep mode suggested.';
    } else if (focusLabel === 'Low' && (burnoutLabel === 'High' || burnoutLabel === 'Moderate')) {
        message = '😴 You seem tired. Short mode suggested.';
    }
    if (load === 'heavy') {
        message += ' (Heavy load – consider shorter session)';
    } else if (load === 'light') {
        message += ' (Light load – you can go longer)';
    }
    suggestionEl.textContent = message;
}

function updatePomoHint() {
    const hintEl = document.getElementById('pomoHint');
    if (hintEl) {
        hintEl.textContent = 'Chosen the suggested settings based on focus and burnout';
    }
}

function validateAddTaskTitle() {
    const val = addTitle.value.trim();
    const len = val.length;
    addTitleCount.textContent = len;
    if (len < 1 || len > 30) {
        addTitleError.style.display = 'block';
        confirmAddBtn.disabled = true;
        return false;
    } else {
        addTitleError.style.display = 'none';
        confirmAddBtn.disabled = false;
        return true;
    }
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

    const openModal = (modal) => {
        if (modal) { modal.classList.add('show'); modal.setAttribute('aria-hidden', 'false'); }
    };
    const closeModal = (modal) => {
        if (modal) { modal.classList.remove('show'); modal.setAttribute('aria-hidden', 'true'); }
    };

    // Sidebar Ghost Mode link – open confirmation modal
    document.getElementById('sidebarGhostLink')?.addEventListener('click', function(e) {
        e.preventDefault();
        const ghostConfirmModal = document.getElementById('ghostConfirmModal');
        openModal(ghostConfirmModal);
        const startModal = document.getElementById('startSessionModal');
        startModal.dataset.fromSidebar = 'true';
    });

    // Smart Start flow
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            openModal(startModal);
            startModal.dataset.fromSidebar = 'false';
            showStartModalTaskList();
        });
    }

    document.getElementById('smartStartAddNewBtn')?.addEventListener('click', () => {
        closeModal(startModal);
        openAddTaskModal(undefined, 'smartstart');
    });

    document.getElementById('addTaskFromSmartStart')?.addEventListener('click', () => {
        closeModal(startModal);
        openAddTaskModal(undefined, 'smartstart');
    });

    document.querySelectorAll('input[name="sessionType"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const isPomo = document.querySelector('input[name="sessionType"]:checked')?.value === 'pomodoro';
            document.getElementById('singleSettings').style.display = isPomo ? 'none' : 'flex';
            document.getElementById('pomodoroSettings').style.display = isPomo ? 'flex' : 'none';

            if (!isPomo) {
                if (startModal._chosenTask) {
                    updateSingleSuggestion(startModal._chosenTask.load);
                } else {
                    updateSingleSuggestion('medium');
                }
                document.getElementById('pomoHint').style.display = 'none';
            } else {
                document.getElementById('pomoHint').style.display = 'block';
                if (startModal._chosenTask) {
                    applyRecommendedSettings(startModal._chosenTask);
                } else {
                    const s = getRecommendedPomodoro(getBurnoutScore(), getFocusScore(), 'medium');
                    document.getElementById('pomoFocusValue').textContent = s.focusMin;
                    document.getElementById('pomoBreakValue').textContent = s.breakMin;
                    document.getElementById('pomoLongBreakValue').textContent = s.longBreakMin;
                    document.getElementById('pomoSessionsValue').textContent = s.sessions;
                }
                updatePomoHint();
            }
        });
    });

    document.querySelector('input[name="sessionType"]:checked')?.dispatchEvent(new Event('change'));

    document.getElementById('smartStartBack')?.addEventListener('click', () => {
        document.getElementById('smartStartTaskList').style.display = 'block';
        document.getElementById('smartStartTimerStep').style.display = 'none';
        document.getElementById('smartStartBack').style.display = 'none';
    });

    document.getElementById('startGhostBtn')?.addEventListener('click', function() {
        const task = startModal._chosenTask;
        if (!task) return;

        let sessionType = document.querySelector('input[name="sessionType"]:checked')?.value || 'single';
        let chosen;

        if (startModal.dataset.fromSidebar === 'true') {
            chosen = 'ghost';
        } else {
            chosen = document.querySelector('input[name="startMode"]:checked')?.value || 'ghost';
        }

        const ghostMode = chosen === 'ghost';
        const soundscape = chosen === 'soundscape';
        const params = {
            taskName: task.title,
            taskLoad: task.load,
            sessionType,
            ghostMode: ghostMode,
            soundscape: soundscape
        };
        if (sessionType === 'single') {
            const selectedDuration = document.querySelector('input[name="singleDuration"]:checked')?.value;
            params.durationMin = selectedDuration ? parseInt(selectedDuration, 10) : 10;
        } else {
            params.focusMin = parseInt(document.getElementById('pomoFocusValue').textContent, 10) || 25;
            params.breakMin = parseInt(document.getElementById('pomoBreakValue').textContent, 10) || 5;
            params.longBreakMin = parseInt(document.getElementById('pomoLongBreakValue').textContent, 10) || 20;
            params.sessionsBeforeLong = parseInt(document.getElementById('pomoSessionsValue').textContent, 10) || 4;
        }
        sessionStorage.setItem('ghostSession', JSON.stringify(params));
        closeModal(startModal);
        window.location.href = 'ghost.html';
    });

    startModal?.addEventListener('click', (e) => { if (e.target === startModal) closeModal(startModal); });

    document.getElementById('confirmAddTask')?.addEventListener('click', () => {
        const title = document.getElementById('addTaskTitle')?.value?.trim();
        if (!title || title.length < 1 || title.length > 30) {
            document.getElementById('addTaskTitleError').style.display = 'block';
            return;
        }

        const startVal = document.getElementById('addTaskStart')?.value || '';
        const dateStr = startVal.slice(0, 10);

        const activeLoadBtn = document.querySelector('.load-btn.active');
        const load = activeLoadBtn ? activeLoadBtn.dataset.load : 'medium';

        const task = {
            title,
            desc: document.getElementById('addTaskDesc')?.value?.trim() || '',
            start: startVal,
            end: document.getElementById('addTaskEnd')?.value || '',
            load
        };

        const source = document.getElementById('addTaskModal').dataset.source || 'todo';

        saveTaskFromAddModal(dateStr, task);
        closeAddTaskModal();
        initializeTodo();
        if (typeof renderCalendar === 'function') {
            renderCalendar(smallCalYear, smallCalMonth);
        }

        if (source === 'smartstart') {
            openModal(startModal);
            showStartModalTaskList();
        }
    });

    document.getElementById('cancelAddTask')?.addEventListener('click', closeAddTaskModal);
    addTaskModal?.addEventListener('click', (e) => { if (e.target === addTaskModal) closeAddTaskModal(); });

    if (clearBrainBtn) clearBrainBtn.addEventListener('click', () => openModal(brainFogModal));
    brainFogModal?.addEventListener('click', (e) => { if (e.target === brainFogModal) closeModal(brainFogModal); });

    document.getElementById('brainFogStartTask')?.addEventListener('click', function() {
        if (typeof recordBrainFogUsed === 'function') recordBrainFogUsed();
        updateStateBar();
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

    document.querySelectorAll('.load-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.load-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Stepper controls
    function setupStepper(btn, delta) {
        const targetId = btn.dataset.target;
        const valueSpan = document.getElementById(targetId + 'Value');
        let current = parseInt(valueSpan.textContent, 10);
        let min = 1, max = 60;
        if (targetId === 'pomoFocus') { min = 10; max = 60; }
        else if (targetId === 'pomoBreak') { min = 1; max = 15; }
        else if (targetId === 'pomoLongBreak') { min = 5; max = 45; }
        else if (targetId === 'pomoSessions') { min = 2; max = 8; }

        let newVal = current + delta;
        if (newVal >= min && newVal <= max) {
            valueSpan.textContent = newVal;
        }
    }

    document.querySelectorAll('.stepper-btn.plus').forEach(btn => {
        btn.addEventListener('click', () => setupStepper(btn, 1));
    });
    document.querySelectorAll('.stepper-btn.minus').forEach(btn => {
        btn.addEventListener('click', () => setupStepper(btn, -1));
    });

    const ghostConfirmModal = document.getElementById('ghostConfirmModal');
    const ghostConfirmBack = document.getElementById('ghostConfirmBack');
    const ghostConfirmStart = document.getElementById('ghostConfirmStart');

    if (ghostConfirmBack) {
        ghostConfirmBack.addEventListener('click', () => closeModal(ghostConfirmModal));
    }
    if (ghostConfirmStart) {
        ghostConfirmStart.addEventListener('click', () => {
            closeModal(ghostConfirmModal);
            openModal(startModal);
            showStartModalTaskList();
        });
    }
    if (ghostConfirmModal) {
        ghostConfirmModal.addEventListener('click', (e) => {
            if (e.target === ghostConfirmModal) closeModal(ghostConfirmModal);
        });
    }
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
    const keys = ['user_stats', 'todoItems', 'calendarTasks', 'events', 'focusHistory', 'burnoutHistory', 'ghostSession', 'study_sessions'];
    keys.forEach(k => localStorage.removeItem(k));
    localStorage.removeItem('user_stats');
    try { initializeTodo(); } catch (e) { }
    try { if (typeof renderCalendar === 'function') renderCalendar(smallCalYear, smallCalMonth); } catch (e) { }
    try { updateStateBar(); } catch (e) { }
    alert('All data reset.');
}

function deleteTask(taskId, taskTitle) {
    let todoItems = JSON.parse(localStorage.getItem('todoItems') || '[]');
    todoItems = todoItems.filter(item => item.id !== taskId);
    localStorage.setItem('todoItems', JSON.stringify(todoItems));

    const calendarData = JSON.parse(localStorage.getItem('calendarTasks') || '{}');
    const today = new Date().toISOString().slice(0, 10);

    if (calendarData[today]) {
        calendarData[today] = calendarData[today].filter(t => t.title !== taskTitle);
        if (calendarData[today].length === 0) delete calendarData[today];
        localStorage.setItem('calendarTasks', JSON.stringify(calendarData));
    }

    renderTodoUI();
}

function populateSmartStartTasks() {
    const taskContainer = document.getElementById('smartStartTaskContainer');
    const todoItems = JSON.parse(localStorage.getItem('todoItems') || '[]');

    const pendingTasks = todoItems.filter(t => !t.completed);
    const finishedTasks = todoItems.filter(t => t.completed);

    let html = `<h4>📌 Active Tasks</h4>`;
    if (pendingTasks.length === 0) html += `<p class="empty-msg">No active tasks</p>`;

    pendingTasks.forEach(task => {
        html += `<button class="task-opt" onclick="selectTask('${task.title}')">${task.title}</button>`;
    });

    if (finishedTasks.length > 0) {
        html += `<h4 class="done-label">✅ Recently Finished</h4>`;
        finishedTasks.forEach(task => {
            html += `<button class="task-opt finished" onclick="selectTask('${task.title}')">${task.title}</button>`;
        });
    }

    taskContainer.innerHTML = html;
}