// Simple full calendar page script with add-task modal and storage
// Includes completion check from todoItems and finished styling

const calendarLarge = (function(){
    const grid = document.getElementById('calendarGridLarge');
    const monthDisplay = document.getElementById('monthDisplayLarge');
    const todayBtn = document.getElementById('todayBtn');
    const prevBtn = document.getElementById('prevMonthBtnTop');
    const nextBtn = document.getElementById('nextMonthBtnTop');
    const modal = document.getElementById('taskModal');
    const titleInput = document.getElementById('taskTitle');
    const descInput = document.getElementById('taskDesc');
    const startInput = document.getElementById('taskStart');
    const endInput = document.getElementById('taskEnd');
    const cancelBtn = document.getElementById('cancelTask');
    const confirmBtn = document.getElementById('confirmTask');

    let current = new Date();
    let selDate = null;

    function formatYMD(date){
        const y = date.getFullYear();
        const m = String(date.getMonth()+1).padStart(2,'0');
        const d = String(date.getDate()).padStart(2,'0');
        return `${y}-${m}-${d}`;
    }

    function loadTasksFor(dateStr){
        const raw = localStorage.getItem('calendarTasks');
        if (!raw) return [];
        const obj = JSON.parse(raw);
        return obj[dateStr] || [];
    }

    function saveTask(dateStr, task){
        const raw = localStorage.getItem('calendarTasks');
        const obj = raw ? JSON.parse(raw) : {};
        obj[dateStr] = obj[dateStr] || [];
        obj[dateStr].push(task);
        localStorage.setItem('calendarTasks', JSON.stringify(obj));

        // Also add a todo item for the home page with load
        try {
            const rawTodos = localStorage.getItem('todoItems');
            const todos = rawTodos ? JSON.parse(rawTodos) : [];
            todos.push({
                title: task.title,
                date: dateStr,
                completed: false,
                load: task.load  // store load
            });
            localStorage.setItem('todoItems', JSON.stringify(todos));
        } catch (e) {
            console.error('Could not save todo item', e);
        }
    }

    function render(){
        grid.innerHTML = '';
        const year = current.getFullYear();
        const month = current.getMonth();
        const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        monthDisplay.textContent = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month+1, 0).getDate();
        const prevLastDate = new Date(year, month, 0).getDate();

        // Get todoItems once to check completion status
        const todoItems = JSON.parse(localStorage.getItem('todoItems') || '[]');

        // Show weekday labels
        const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        days.forEach(d=>{
            const label = document.createElement('div');
            label.className = 'calendar-day-large';
            label.style.minHeight = '36px';
            label.innerHTML = `<div class="date-num" style="font-weight:600">${d}</div>`;
            grid.appendChild(label);
        });

        // Previous month days
        for (let i = firstDay-1; i>=0; i--){
            const cell = document.createElement('div');
            cell.className = 'calendar-day-large other-month';
            cell.innerHTML = `<div class="date-num">${prevLastDate - i}</div>`;
            grid.appendChild(cell);
        }

        // Current month days
        for (let d=1; d<=lastDate; d++){
            const date = new Date(year, month, d);
            const dateStr = formatYMD(date);
            const cell = document.createElement('div');
            cell.className = 'calendar-day-large';
            cell.dataset.date = dateStr;

            const dateNum = document.createElement('div');
            dateNum.className = 'date-num';
            dateNum.textContent = d;
            cell.appendChild(dateNum);

            const addBtn = document.createElement('button');
            addBtn.className = 'add-day-btn';
            addBtn.title = 'Add task';
            addBtn.innerHTML = '+';
            addBtn.addEventListener('click', (e)=>{
                e.stopPropagation();
                openModalFor(dateStr);
            });
            cell.appendChild(addBtn);

            // Tasks container
            const tasksWrap = document.createElement('div');
            tasksWrap.className = 'tasks';

            const tasks = loadTasksFor(dateStr);
            tasks.forEach(t => {
                // Find matching todo item by title and date
                const todo = todoItems.find(item => item.title === t.title && item.date === dateStr);
                const isFinished = todo ? todo.completed : false;

                const pill = document.createElement('div');
                pill.className = `task-pill ${isFinished ? 'finished' : ''}`;
                pill.textContent = t.title;
                pill.title = isFinished ? 'Completed' : 'Open in To-do';
                pill.addEventListener('click', ()=>{
                    window.location.href = 'index.html#todoPanel';
                });
                tasksWrap.appendChild(pill);
            });

            cell.appendChild(tasksWrap);
            grid.appendChild(cell);
        }

        // Next month filler to complete rows
        const totalCells = firstDay + lastDate;
        const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let i=1;i<=remaining;i++){
            const cell = document.createElement('div');
            cell.className = 'calendar-day-large other-month';
            cell.innerHTML = `<div class="date-num">${i}</div>`;
            grid.appendChild(cell);
        }
    }

    function openModalFor(dateStr){
        selDate = dateStr;

        // Reset load selector to default (Medium)
        document.querySelectorAll('.load-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.load-btn.medium')?.classList.add('active');

        modal.classList.add('show');
        modal.setAttribute('aria-hidden','false');
        titleInput.focus();
        const start = dateStr + 'T09:00';
        const end = dateStr + 'T10:00';
        startInput.value = start;
        endInput.value = end;
    }

    function closeModal(){
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden','true');
        titleInput.value = '';
        descInput.value = '';
        startInput.value = '';
        endInput.value = '';
        selDate = null;
    }

    // Load button toggle functionality
    document.querySelectorAll('.load-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.load-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    confirmBtn.addEventListener('click', ()=>{
        const title = titleInput.value.trim();
        if (!title) return alert('Please enter a title');

        // Get selected load
        const activeLoadBtn = document.querySelector('.load-btn.active');
        const load = activeLoadBtn ? activeLoadBtn.dataset.load : 'medium';

        const task = {
            title,
            desc: descInput.value.trim(),
            start: startInput.value,
            end: endInput.value,
            load: load  // include load
        };
        saveTask(selDate, task);
        closeModal();
        render();
    });

    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e)=>{ if (e.target === modal) closeModal(); });

    todayBtn.addEventListener('click', ()=>{ current = new Date(); render(); });
    prevBtn.addEventListener('click', ()=>{ current = new Date(current.getFullYear(), current.getMonth()-1, 1); render(); });
    nextBtn.addEventListener('click', ()=>{ current = new Date(current.getFullYear(), current.getMonth()+1, 1); render(); });

    window.addEventListener('DOMContentLoaded', ()=>{
        render();
        if (location.hash === '#add'){
            const today = new Date();
            openModalFor(formatYMD(today));
        }
    });

    return { render, openModalFor };
})();