// Focus Mode - Timer, Pomodoro, Confusion, Distraction Lock

(function() {
    const focusTaskTitle = document.getElementById('focusTaskTitle');
    const focusModeBadge = document.getElementById('focusModeBadge');
    const focusTimer = document.getElementById('focusTimer');
    const btnDone = document.getElementById('btnDone');
    const btnConfusing = document.getElementById('btnConfusing');
    const distractionLockModal = document.getElementById('distractionLockModal');
    const distractionLockMessage = document.getElementById('distractionLockMessage');
    const stayBtn = document.getElementById('stayBtn');
    const exitBtn = document.getElementById('exitBtn');
    const breakModal = document.getElementById('breakModal');
    const breakTimer = document.getElementById('breakTimer');
    const startBreakBtn = document.getElementById('startBreakBtn');
    const sessionCompleteModal = document.getElementById('sessionCompleteModal');
    const sessionCompleteMessage = document.getElementById('sessionCompleteMessage');
    const finishSessionBtn = document.getElementById('finishSessionBtn');

    // Load session params from sessionStorage (set by dashboard)
    const params = JSON.parse(sessionStorage.getItem('focusSession') || '{}');
    const taskName = params.taskName || 'Biology — Photosynthesis';
    const sessionType = params.sessionType || 'single';
    const isPomodoro = sessionType === 'pomodoro';

    const POMODORO_FOCUS = 25 * 60;
    const POMODORO_BREAK = 5 * 60;
    const POMODORO_LONG_BREAK = 20 * 60;
    const SINGLE_FOCUS = 10 * 60;

    let timeLeft = isPomodoro ? POMODORO_FOCUS : SINGLE_FOCUS;
    let currentMode = 'focus'; // focus | break | longBreak
    let pomodoroCount = 0;
    let timerInterval = null;

    focusTaskTitle.textContent = '📘 ' + taskName;
    if (isPomodoro) {
        focusModeBadge.textContent = '🍅 Focus Session (1/4)';
    } else {
        focusModeBadge.textContent = '⏱ Single Focus';
        focusModeBadge.style.display = 'none';
    }

    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    }

    function updateDisplay() {
        focusTimer.textContent = formatTime(timeLeft);
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
            if (isPomodoro) {
                pomodoroCount++;
                if (pomodoroCount >= 4) {
                    sessionCompleteMessage.textContent = 'You completed 4 sessions.';
                    sessionCompleteModal.classList.add('show');
                    sessionCompleteModal.setAttribute('aria-hidden', 'false');
                } else {
                    breakTimer.textContent = formatTime(POMODORO_BREAK);
                    breakModal.classList.add('show');
                    breakModal.setAttribute('aria-hidden', 'false');
                }
            } else {
                window.location.href = 'index.html';
            }
        } else {
            currentMode = 'focus';
            timeLeft = POMODORO_FOCUS;
            focusModeBadge.textContent = `🍅 Focus Session (${pomodoroCount + 1}/4)`;
            focusTaskTitle.textContent = '📘 ' + taskName;
            updateDisplay();
            startTimer();
        }
    }

    startBreakBtn.addEventListener('click', () => {
        breakModal.classList.remove('show');
        breakModal.setAttribute('aria-hidden', 'true');
        currentMode = 'break';
        timeLeft = POMODORO_BREAK;
        focusModeBadge.textContent = '☕ Break';
        focusModeBadge.style.display = 'inline';
        focusTaskTitle.textContent = '☕ Take a break';
        updateDisplay();
        startTimer();
    });

    finishSessionBtn.addEventListener('click', () => {
        if (typeof recordSessionCompleted === 'function') {
            for (let i = 0; i < 4; i++) recordSessionCompleted();
        }
        sessionStorage.removeItem('focusSession');
        window.location.href = 'index.html';
    });

    btnDone.addEventListener('click', () => {
        if (isPomodoro && currentMode === 'focus') {
            onPhaseComplete();
        } else {
            if (typeof recordSessionCompleted === 'function') recordSessionCompleted();
            window.location.href = 'index.html';
        }
    });

    btnConfusing.addEventListener('click', () => {
        if (typeof recordConfusion === 'function') recordConfusion();
        const topics = JSON.parse(localStorage.getItem('confusionTopics') || '[]');
        if (!topics.includes(taskName)) {
            topics.push(taskName);
            localStorage.setItem('confusionTopics', JSON.stringify(topics));
        }
        alert('Topic saved to Confusion Tracker. Review it later in Insights.');
    });

    // Distraction Lock - beforeunload
    let lockShown = false;
    window.addEventListener('beforeunload', (e) => {
        if (timeLeft > 0 && currentMode === 'focus') {
            e.preventDefault();
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && timeLeft > 0 && currentMode === 'focus') {
            distractionLockMessage.textContent = `You have ${Math.ceil(timeLeft/60)} mins left.`;
            distractionLockModal.classList.add('show');
            distractionLockModal.setAttribute('aria-hidden', 'false');
        }
    });

    stayBtn.addEventListener('click', () => {
        distractionLockModal.classList.remove('show');
        distractionLockModal.setAttribute('aria-hidden', 'true');
    });

    exitBtn.addEventListener('click', () => {
        if (typeof recordEarlyExit === 'function') recordEarlyExit();
        if (typeof recordDistraction === 'function') recordDistraction();
        sessionStorage.removeItem('focusSession');
        window.location.href = 'index.html';
    });

    updateDisplay();
    startTimer();
})();
