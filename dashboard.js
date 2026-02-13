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
        {
            text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
            author: "Ralph Waldo Emerson"
        },
        {
            text: "Your time is limited, don't waste it living someone else's life.",
            author: "Steve Jobs"
        },
        {
            text: "The only impossible journey is the one you never begin.",
            author: "Tony Robbins"
        },
        {
            text: "Success is not final, failure is not fatal.",
            author: "Winston Churchill"
        },
        {
            text: "The future belongs to those who believe in the beauty of their dreams.",
            author: "Eleanor Roosevelt"
        },
        {
            text: "Don't watch the clock; do what it does. Keep going.",
            author: "Sam Levenson"
        },
        {
            text: "The only way to do great work is to love what you do.",
            author: "Steve Jobs"
        },
        {
            text: "Believe you can and you're halfway there.",
            author: "Theodore Roosevelt"
        }
    ]
};

// Preset labels for the two action buttons. Right-click (context menu)
// cycles through the available presets without changing primary click behavior.
const buttonPresets = {
    yes: [
        "Yes! 💪",
        "Absolutely ✅",
        "I'm in! 🚀",
        "Let's go! 🔥",
        "Count me in 🙌",
        "Heck yes! 🎯",
        "Bring it on! 💥",
        "All set ✅",
        "Game on! 🎮",
        "On it! ⚡",
        "Let's do this! 🔥",
        "Forward! ⤴️",
        "Ready! 👍",
        "Yes, let's! ✨",
        "Let's begin 🏁"
    ],
    no: [
        "Not Yet 😴",
        "Maybe later ⏳",
        "Need prep ⚙️",
        "Not today 💤",
        "In a bit",
        "I'll pass for now 🙃",
        "Need more coffee ☕",
        "Not ready ❌",
        "Give me time 🕰️",
        "Later please 🙏",
        "I'll prep first 🛠️",
        "Not quite yet 🤏",
        "Give me a moment",
        "Try later 🔁"
    ]
};

// Track current index for each button's preset
let _yesPresetIndex = 0;
let _noPresetIndex = 0;

// Rotation interval (seconds) used for quote changes and loader animation
const ROTATION_INTERVAL = 12;

// Small dashboard calendar current state
let smallCalYear = null;
let smallCalMonth = null;


// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeMotivation();
    initializeCalendar();
    initializeTodo();
    startRotation();
});

// ==================== Motivation Functions ====================
function initializeMotivation() {
    // Randomize button presets once per page load
    _yesPresetIndex = Math.floor(Math.random() * buttonPresets.yes.length);
    _noPresetIndex = Math.floor(Math.random() * buttonPresets.no.length);

    updateMotivationContent();
    
    document.getElementById('yesBtn').addEventListener('click', handleAffirmationClick);
    document.getElementById('noBtn').addEventListener('click', () => {
        updateMotivationContent();
    });
    
    document.getElementById('yesBtnSmall').addEventListener('click', showDashboard);
    document.getElementById('noBtnSmall').addEventListener('click', hideDashboard);
    
    document.getElementById('refreshBtn').addEventListener('click', () => {
        updateMotivationContent();
    });
    
    document.getElementById('refreshBtnMini').addEventListener('click', () => {
        updateMotivationContent();
    });

    // Initialize button texts from presets
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const yesBtnSmall = document.getElementById('yesBtnSmall');
    const noBtnSmall = document.getElementById('noBtnSmall');

    if (yesBtn) yesBtn.textContent = buttonPresets.yes[_yesPresetIndex];
    if (noBtn) noBtn.textContent = buttonPresets.no[_noPresetIndex];
    if (yesBtnSmall) yesBtnSmall.textContent = buttonPresets.yes[_yesPresetIndex];
    if (noBtnSmall) noBtnSmall.textContent = buttonPresets.no[_noPresetIndex];

    // Start or reset loader animation to match rotation interval
    restartLoader();

    // Right-click to cycle through presets (keeps normal click behavior intact)
    const cyclePreset = (btn, list, indexRefName) => {
        btn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (indexRefName === 'yes') {
                _yesPresetIndex = (_yesPresetIndex + 1) % list.length;
                btn.textContent = list[_yesPresetIndex];
            } else {
                _noPresetIndex = (_noPresetIndex + 1) % list.length;
                btn.textContent = list[_noPresetIndex];
            }
        });
    };

    if (yesBtn) cyclePreset(yesBtn, buttonPresets.yes, 'yes');
    if (noBtn) cyclePreset(noBtn, buttonPresets.no, 'no');
    if (yesBtnSmall) cyclePreset(yesBtnSmall, buttonPresets.yes, 'yes');
    if (noBtnSmall) cyclePreset(noBtnSmall, buttonPresets.no, 'no');
}

// Restart the loader animation (reset and reapply) so it syncs with content changes
function restartLoader() {
    const loaderBar = document.querySelector('.motivation-loader .bar');
    if (!loaderBar) return;

    // Apply correct duration
    loaderBar.style.animationDuration = ROTATION_INTERVAL + 's';

    // Reset animation by toggling the element
    loaderBar.style.animation = 'none';
    // Force reflow
    // eslint-disable-next-line no-unused-expressions
    loaderBar.offsetHeight;
    loaderBar.style.animation = '';
}

function updateMotivationContent() {
    const quoteIndex = Math.floor(Math.random() * motivationPresets.quotes.length);
    const questionIndex = Math.floor(Math.random() * motivationPresets.questions.length);
    const questionSmallIndex = Math.floor(Math.random() * motivationPresets.questionsSmall.length);
    
    const quote = motivationPresets.quotes[quoteIndex];
    
    document.getElementById('motivationQuote').textContent = `"${quote.text}"`;
    document.getElementById('quoteAuthor').textContent = `— ${quote.author}`;
    document.getElementById('motivationQuestion').textContent = motivationPresets.questions[questionIndex];
    document.getElementById('motivationQuestionSmall').textContent = motivationPresets.questionsSmall[questionSmallIndex];

    // Restart loader animation when content updates
    restartLoader();
}

function startRotation() {
    setInterval(() => {
        const motivationFull = document.getElementById('motivationFull');
        if (motivationFull.style.display !== 'none') {
            updateMotivationContent();
        }
    }, ROTATION_INTERVAL * 1000); // Change every ROTATION_INTERVAL seconds
}

function showDashboard() {
    document.getElementById('motivationFull').style.display = 'none';
    document.getElementById('dashboardLayout').style.display = 'flex';
}

function hideDashboard() {
    document.getElementById('motivationFull').style.display = 'flex';
    document.getElementById('dashboardLayout').style.display = 'none';
    updateMotivationContent();
}

// Handle affirmation when motivation is full: show bottom trays with calendar and todo
function handleAffirmationClick() {
    const motivationFull = document.getElementById('motivationFull');
    const dashboardLayout = document.getElementById('dashboardLayout');

    // If the full dashboard is already shown, open dashboard instead
    if (dashboardLayout && dashboardLayout.style.display !== 'none') {
        showDashboard();
        return;
    }

    // Show the Motivation Wall and open bottom trays with animation
    if (motivationFull) {
        motivationFull.style.display = 'flex';
        showBottomTrays();
    }
}

function showBottomTrays() {
    const motivationFull = document.getElementById('motivationFull');
    const motivationCard = motivationFull.querySelector('.motivation-card');
    const questionSection = motivationFull.querySelector('.question-section');
    
    if (!motivationCard || !questionSection) return;

    // Minimize the motivation card with animation
    motivationCard.classList.add('minimized');
    motivationFull.classList.add('trays-active');

    // Check if panels container already exists
    let panelsContainer = motivationFull.querySelector('.panels-container');
    if (!panelsContainer) {
        // Create panels container
        panelsContainer = document.createElement('div');
        panelsContainer.className = 'panels-container';
        
        // Get calendar and todo from dashboard layout
        const calendar = document.querySelector('.calendar-panel');
        const todo = document.querySelector('.todo-panel');
        
        if (calendar && todo) {
            // Clone and move them into the panels container
            const calendarClone = calendar.cloneNode(true);
            const todoClone = todo.cloneNode(true);
            
            calendarClone.classList.add('in-tray');
            todoClone.classList.add('in-tray');
            
            panelsContainer.appendChild(calendarClone);
            panelsContainer.appendChild(todoClone);
            
            // Add close buttons
            const calHeader = calendarClone.querySelector('.panel-header');
            const todoHeader = todoClone.querySelector('.panel-header');
            
            if (calHeader) {
                const closeBtn = document.createElement('button');
                closeBtn.className = 'tray-close';
                closeBtn.textContent = '✕';
                closeBtn.addEventListener('click', hideBottomTrays);
                calHeader.appendChild(closeBtn);
            }
            
            if (todoHeader) {
                const closeBtn = document.createElement('button');
                closeBtn.className = 'tray-close';
                closeBtn.textContent = '✕';
                closeBtn.addEventListener('click', hideBottomTrays);
                todoHeader.appendChild(closeBtn);
            }
        }
        
        motivationFull.appendChild(panelsContainer);
    }
    
    // Trigger animation
    setTimeout(() => {
        panelsContainer.classList.add('visible');
    }, 10);
}

function hideBottomTrays() {
    const motivationFull = document.getElementById('motivationFull');
    const motivationCard = motivationFull.querySelector('.motivation-card');
    const panelsContainer = motivationFull.querySelector('.panels-container');
    
    if (!motivationCard || !panelsContainer) return;

    // Remove animation and visibility
    panelsContainer.classList.remove('visible');
    
    // After animation completes, remove the container
    setTimeout(() => {
        panelsContainer.remove();
        motivationCard.classList.remove('minimized');
        motivationFull.classList.remove('trays-active');
    }, 400);
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
        // apply out animation
        daysEl.classList.remove('anim-in-left','anim-in-right');
        daysEl.classList.add(direction === 'prev' ? 'anim-out-right' : 'anim-out-left');
        setTimeout(()=>{
            // update state
            if (direction === 'prev') {
                smallCalMonth -= 1;
                if (smallCalMonth < 0) { smallCalMonth = 11; smallCalYear -= 1; }
            } else {
                smallCalMonth += 1;
                if (smallCalMonth > 11) { smallCalMonth = 0; smallCalYear += 1; }
            }
            renderCalendar(smallCalYear, smallCalMonth, direction);
            // play in animation
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
    
    // Update month display
    document.getElementById('monthDisplay').textContent = `${monthNames[month]} ${year}`;
    
    const monthDiv = document.createElement('div');
    monthDiv.className = 'calendar-month';
    
    // Weekday headers
    const weekdaysDiv = document.createElement('div');
    weekdaysDiv.className = 'calendar-weekdays';
    dayNames.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-weekday';
        dayEl.textContent = day;
        weekdaysDiv.appendChild(dayEl);
    });
    monthDiv.appendChild(weekdaysDiv);
    
    // Days
    const daysDiv = document.createElement('div');
    daysDiv.className = 'calendar-days';
    
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();
    
    const today = new Date();
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
    const todayDate = today.getDate();
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day other-month';
        dayEl.textContent = prevLastDate - i;
        daysDiv.appendChild(dayEl);
    }
    
    // Current month days
    for (let i = 1; i <= lastDate; i++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        // wrap number so we can bold when tasks exist
        const num = document.createElement('div');
        num.className = 'calendar-day-num';
        num.textContent = i;
        dayEl.appendChild(num);
        // check for tasks in storage
        const yearStr = String(year).padStart(4,'0');
        const monthStr = String(month+1).padStart(2,'0');
        const dayStr = String(i).padStart(2,'0');
        const dateKey = `${yearStr}-${monthStr}-${dayStr}`;
        try {
            const raw = localStorage.getItem('calendarTasks');
            const obj = raw ? JSON.parse(raw) : {};
            const tasks = obj[dateKey] || [];
            if (tasks.length > 0) {
                dayEl.classList.add('has-task');
            }
        } catch (e) {}
        
        if (isCurrentMonth && i === todayDate) {
            dayEl.classList.add('today');
        }

        daysDiv.appendChild(dayEl);
    }
    
    // Next month days
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
    // Redirect the add button to the full calendar page and open add modal there
    const addBtn = document.getElementById('addTodoBtn');
    if (addBtn) {
        addBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Navigate to calendar page and open add modal for today
            window.location.assign('calendar.html#add');
        });
    }
    
    // Render stored todos (if any)
    const todoListEl = document.getElementById('todoList');
    if (todoListEl) {
        todoListEl.innerHTML = '';
        const raw = localStorage.getItem('todoItems');
        const items = raw ? JSON.parse(raw) : [];
        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            li.innerHTML = `\n                <input type="checkbox" class="todo-checkbox" ${item.completed ? 'checked' : ''}>\n                <span>${item.title}${item.date ? ' — ' + item.date : ''}</span>\n            `;
            todoListEl.appendChild(li);
        });

        // Bind new check handlers
        todoListEl.querySelectorAll('.todo-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                // Update storage
                const raw2 = localStorage.getItem('todoItems');
                const items2 = raw2 ? JSON.parse(raw2) : [];
                const idx = Array.from(todoListEl.querySelectorAll('.todo-item')).indexOf(this.parentElement);
                if (items2[idx]) items2[idx].completed = this.checked;
                localStorage.setItem('todoItems', JSON.stringify(items2));
            });
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
