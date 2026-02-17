// Ghost Mode - Timer, Leave confirmation, Focus display, Music

(function() {
    if (!sessionStorage.getItem('ghostSession')) {
        window.location.href = 'index.html';
        return;
    }
    const params = JSON.parse(sessionStorage.getItem('ghostSession') || '{}');
    const taskName = params.taskName || 'Task';
    const sessionType = params.sessionType || 'single';
    const hasTask = !!params.taskName;
    const soundscape = params.soundscape || false;

    const isPomodoro = sessionType === 'pomodoro';
    let focusMin = params.focusMin || 25;
    let breakMin = params.breakMin || 5;
    let longBreakMin = params.longBreakMin || 20;
    let sessionsBeforeLong = params.sessionsBeforeLong || 4;
    let singleDuration = params.durationMin || 10;

    if (isPomodoro) {
        focusMin = params.focusMin || 25;
        breakMin = params.breakMin || 5;
        longBreakMin = params.longBreakMin || 20;
        sessionsBeforeLong = params.sessionsBeforeLong || 4;
    }

    let timeLeft = isPomodoro ? focusMin * 60 : singleDuration * 60;
    let currentMode = 'focus';
    let pomodoroCount = 0;
    let timerInterval = null;

    const ghostTaskTitle = document.getElementById('ghostTaskTitle');
    const ghostModeBadge = document.getElementById('ghostModeBadge');
    const ghostTimer = document.getElementById('ghostTimer');
    const ghostLeaveBtn = document.getElementById('ghostLeaveBtn');
    const ghostTestBtn = document.getElementById('ghostTestBtn');
    const btnFinished = document.getElementById('btnFinished');
    const btnConfusing = document.getElementById('btnConfusing');
    const leaveModal = document.getElementById('leaveConfirmModal');
    const leaveMessage = document.getElementById('leaveConfirmMessage');
    const stayBtn = document.getElementById('stayBtn');
    const confirmLeaveBtn = document.getElementById('confirmLeaveBtn');
    const finishedModal = document.getElementById('finishedConfirmModal');
    const cancelFinishedBtn = document.getElementById('cancelFinishedBtn');
    const confirmFinishedBtn = document.getElementById('confirmFinishedBtn');
    const breakModal = document.getElementById('breakModal');
    const breakTimerEl = document.getElementById('breakTimer');
    const startBreakBtn = document.getElementById('startBreakBtn');
    const sessionCompleteModal = document.getElementById('sessionCompleteModal');
    const finishSessionBtn = document.getElementById('finishSessionBtn');
    const ghostMusic = document.getElementById('ghostMusic');
    const ghostMusicToggle = document.getElementById('ghostMusicToggle');

    ghostTaskTitle.textContent = '📘 ' + taskName;
    if (isPomodoro) {
        ghostModeBadge.textContent = `🍅 Focus Session (1/${sessionsBeforeLong})`;
    } else {
        ghostModeBadge.textContent = '⏱ Single Focus';
    }

    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    }

    function updateDisplay() {
        ghostTimer.textContent = formatTime(timeLeft);
    }

    function updateFocusDisplay() {
        if (typeof getFocusScore !== 'function' || typeof getFocusLabel !== 'function') return;
        const score = getFocusScore();
        const label = getFocusLabel(score);
        const barFilled = Math.round((score / 100) * 8);
        const barStr = '█'.repeat(barFilled) + '░'.repeat(8 - barFilled);
        const barEl = document.getElementById('ghostFocusBar');
        const labelEl = document.getElementById('ghostFocusLabel');
        if (barEl) barEl.textContent = barStr;
        if (labelEl) labelEl.textContent = label;
    }

    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                onPhaseComplete();
            }
        }, 1000);
    }

    function onPhaseComplete() {
        if (currentMode === 'focus') {
            // Record completed session with duration
            if (typeof recordSessionCompleted === 'function') {
                const duration = isPomodoro ? focusMin : singleDuration;
                recordSessionCompleted(duration);
            }
            if (isPomodoro) {
                pomodoroCount++;
                if (pomodoroCount >= sessionsBeforeLong) {
                    sessionCompleteModal.classList.add('show');
                    sessionCompleteModal.setAttribute('aria-hidden', 'false');
                } else {
                    breakTimerEl.textContent = formatTime(breakMin * 60);
                    breakModal.classList.add('show');
                    breakModal.setAttribute('aria-hidden', 'false');
                }
            } else {
                redirectHome();
            }
        } else {
            currentMode = 'focus';
            timeLeft = focusMin * 60;
            ghostModeBadge.textContent = `🍅 Focus Session (${pomodoroCount + 1}/${sessionsBeforeLong})`;
            ghostTaskTitle.textContent = '📘 ' + taskName;
            updateDisplay();
            startTimer();
        }
    }

    function redirectHome() {
        sessionStorage.removeItem('ghostSession');
        window.location.href = 'index.html';
    }

    startBreakBtn?.addEventListener('click', () => {
        breakModal.classList.remove('show');
        breakModal.setAttribute('aria-hidden', 'true');
        currentMode = 'break';
        timeLeft = breakMin * 60;
        ghostModeBadge.textContent = '☕ Break';
        ghostTaskTitle.textContent = '☕ Take a break';
        updateDisplay();
        startTimer();
    });

    finishSessionBtn?.addEventListener('click', () => {
        sessionStorage.removeItem('ghostSession');
        window.location.href = 'index.html';
    });

    btnFinished?.addEventListener('click', () => {
        finishedModal.classList.add('show');
        finishedModal.setAttribute('aria-hidden', 'false');
    });

    cancelFinishedBtn?.addEventListener('click', () => {
        finishedModal.classList.remove('show');
        finishedModal.setAttribute('aria-hidden', 'true');
    });

    confirmFinishedBtn?.addEventListener('click', () => {
    const params = JSON.parse(sessionStorage.getItem('ghostSession') || '{}');
    const taskName = params.taskName;

    // Update global todo list
    let tasks = JSON.parse(localStorage.getItem('todoItems') || '[]');
    const taskIndex = tasks.findIndex(t => t.title === taskName);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = true;
        localStorage.setItem('todoItems', JSON.stringify(tasks));
    }

    // Record stats and exit
    if (typeof recordSessionComplete === 'function') recordSessionComplete();
    sessionStorage.removeItem('ghostSession'); 
    redirectHome();
});

    btnConfusing?.addEventListener('click', () => {
        if (typeof recordConfusion === 'function') recordConfusion();
        const topics = JSON.parse(localStorage.getItem('confusionTopics') || '[]');
        if (!topics.includes(taskName)) {
            topics.push(taskName);
            localStorage.setItem('confusionTopics', JSON.stringify(topics));
        }
        alert('Topic saved to Confusion Tracker. Review it later in Insights.');
    });

    ghostTestBtn?.addEventListener('click', () => {
        timeLeft = 10;
        updateDisplay();
    });

    ghostLeaveBtn?.addEventListener('click', () => {
        if (timeLeft > 0) {
            leaveMessage.textContent = `You have ${Math.ceil(timeLeft/60)} mins left. Leaving will count as an early exit and affect your Focus & Burnout.`;
            leaveModal.classList.add('show');
            leaveModal.setAttribute('aria-hidden', 'false');
        } else {
            redirectHome();
        }
    });

    stayBtn?.addEventListener('click', () => {
        leaveModal.classList.remove('show');
        leaveModal.setAttribute('aria-hidden', 'true');
    });

    confirmLeaveBtn?.addEventListener('click', () => {
        if (typeof recordEarlyExit === 'function') recordEarlyExit();
        if (typeof recordDistraction === 'function') recordDistraction();
        redirectHome();
    });

    window.addEventListener('beforeunload', (e) => {
        if (timeLeft > 0 && currentMode === 'focus') e.preventDefault();
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && timeLeft > 0 && currentMode === 'focus') {
            leaveMessage.textContent = `You have ${Math.ceil(timeLeft/60)} mins left.`;
            leaveModal.classList.add('show');
            leaveModal.setAttribute('aria-hidden', 'false');
        }
    });

    // Music: only play when task in session and music enabled
    if (ghostMusic && hasTask && ghostMusicToggle) {
        ghostMusicToggle.checked = soundscape;
        ghostMusicToggle.addEventListener('change', () => {
            if (ghostMusicToggle.checked) ghostMusic.play().catch(() => {});
            else ghostMusic.pause();
        });
        if (soundscape) ghostMusic.play().catch(() => {});
    }
    if (!hasTask && ghostMusicToggle) {
        ghostMusicToggle.checked = false;
        ghostMusicToggle.disabled = true;
    }

    updateFocusDisplay();
    updateDisplay();
    startTimer();
})();