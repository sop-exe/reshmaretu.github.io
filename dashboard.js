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

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeMotivation();
    initializeCalendar();
    initializeTodo();
    startRotation();
});

// ==================== Motivation Functions ====================
function initializeMotivation() {
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
}

function startRotation() {
    setInterval(() => {
        const motivationFull = document.getElementById('motivationFull');
        if (motivationFull.style.display !== 'none') {
            updateMotivationContent();
        }
    }, 12000); // Change every 12 seconds
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
    if (motivationFull && motivationFull.style.display !== 'none') {
        showBottomTrays();
    } else {
        showDashboard();
    }
}

function showBottomTrays() {
    // ensure calendar and todo rendered
    const calendar = document.querySelector('.calendar-panel');
    const todo = document.querySelector('.todo-panel');
    if (!calendar || !todo) return;

    // add tray classes
    calendar.classList.add('tray', 'tray-left');
    todo.classList.add('tray', 'tray-right');

    // ensure internal wrappers scroll
    const calWrap = calendar.querySelector('.calendar-wrapper') || calendar;
    const todoWrap = todo.querySelector('.todo-wrapper') || todo;
    calWrap.style.overflowY = 'auto';
    todoWrap.style.overflowY = 'auto';

    // add close buttons if missing
    if (!calendar.querySelector('.tray-close')) {
        const btn = document.createElement('button');
        btn.className = 'tray-close';
        btn.textContent = '✕';
        btn.addEventListener('click', hideBottomTrays);
        calendar.querySelector('.panel-header').appendChild(btn);
    }
    if (!todo.querySelector('.tray-close')) {
        const btn = document.createElement('button');
        btn.className = 'tray-close';
        btn.textContent = '✕';
        btn.addEventListener('click', hideBottomTrays);
        todo.querySelector('.panel-header').appendChild(btn);
    }

    // slightly reduce motivation card so trays fit
    const motivationCard = document.querySelector('.motivation-card');
    if (motivationCard) {
        motivationCard.style.maxHeight = '320px';
        motivationCard.style.overflow = 'hidden';
    }
}

function hideBottomTrays() {
    const calendar = document.querySelector('.calendar-panel');
    const todo = document.querySelector('.todo-panel');
    if (!calendar || !todo) return;
    calendar.classList.remove('tray', 'tray-left');
    todo.classList.remove('tray', 'tray-right');

    const calWrap = calendar.querySelector('.calendar-wrapper') || calendar;
    const todoWrap = todo.querySelector('.todo-wrapper') || todo;
    calWrap.style.overflowY = '';
    todoWrap.style.overflowY = '';

    // remove tray-close buttons
    calendar.querySelectorAll('.tray-close').forEach(n => n.remove());
    todo.querySelectorAll('.tray-close').forEach(n => n.remove());

    // restore motivation card
    const motivationCard = document.querySelector('.motivation-card');
    if (motivationCard) {
        motivationCard.style.maxHeight = '';
        motivationCard.style.overflow = '';
    }
}

// ==================== Calendar Functions ====================
function initializeCalendar() {
    const now = new Date();
    renderCalendar(now.getFullYear(), now.getMonth());
    
    document.getElementById('prevMonthBtn').addEventListener('click', () => {
        const display = document.getElementById('monthDisplay').textContent;
        const [month, year] = display.split(' ');
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
        const monthIndex = months.indexOf(month);
        const prevMonth = monthIndex === 0 ? 11 : monthIndex - 1;
        const prevYear = monthIndex === 0 ? parseInt(year) - 1 : parseInt(year);
        renderCalendar(prevYear, prevMonth);
    });
    
    document.getElementById('nextMonthBtn').addEventListener('click', () => {
        const display = document.getElementById('monthDisplay').textContent;
        const [month, year] = display.split(' ');
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
        const monthIndex = months.indexOf(month);
        const nextMonth = monthIndex === 11 ? 0 : monthIndex + 1;
        const nextYear = monthIndex === 11 ? parseInt(year) + 1 : parseInt(year);
        renderCalendar(nextYear, nextMonth);
    });
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
        dayEl.textContent = i;
        
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
    document.getElementById('addTodoBtn').addEventListener('click', addTodo);
    
    document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Toggle check
        });
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
