let tasks = [];
let currentFilter = "all";
let searchQuery = "";

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const prioritySelect = document.getElementById('prioritySelect');

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem('tasks');
    if (saved) {
        tasks = JSON.parse(saved);
    } else {
        tasks = [];
    }
}

function getFilteredTasks() {
    let filtered = [...tasks];

    if (searchQuery !== "") {
        filtered = filtered.filter(task => 
            task.text.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    if (currentFilter === "active") {
        filtered = filtered.filter(task => !task.completed);
    } else if (currentFilter === "completed") {
        filtered = filtered.filter(task => task.completed);
    }

    return filtered;
}

function render() {
    const filteredTasks = getFilteredTasks();
    taskList.innerHTML = "";

    if (filteredTasks.length === 0) {
        taskList.innerHTML = "<div style='text-align:center;padding:30px;color:#999;'>✨ Нет задач</div>";
        return;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = task.text;
    
        if (task.completed) {
            span.classList.add('done');
        }

        const prioritySpan = document.createElement('span');
        prioritySpan.textContent = task.priority;
        prioritySpan.style.fontSize = '11px';
        prioritySpan.style.padding = '4px 10px';
        prioritySpan.style.borderRadius = '30px';
        prioritySpan.style.marginLeft = '10px';
        
        if (task.priority === 'Low') {
            prioritySpan.style.background = '#d4e6f1';
            prioritySpan.style.color = '#1f618d';
        } else if (task.priority === 'Medium') {
            prioritySpan.style.background = '#f9e79f';
            prioritySpan.style.color = '#7d6608';
        } else {
            prioritySpan.style.background = '#f5b7b1';
            prioritySpan.style.color = '#922b21';
        }

        const buttonsDiv = document.createElement('div');

        const doneBTN = document.createElement('button');
        doneBTN.textContent = task.completed ? 'Undo' : 'Done';
        doneBTN.addEventListener('click', () => {
            task.completed = !task.completed;
            saveTasks();
            render();
        });

        const editBTN = document.createElement('button');
        editBTN.textContent = 'Edit';
        editBTN.addEventListener('click', () => {
            const newText = prompt('Редактировать задачу:', task.text);
            if (newText !== null && newText.trim() !== "") {
                task.text = newText.trim();
                saveTasks();
                render();
            }
        });

        const deleteBTN = document.createElement('button');
        deleteBTN.textContent = 'Delete';
        deleteBTN.addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            render();
        });

        buttonsDiv.appendChild(doneBTN);
        buttonsDiv.appendChild(editBTN);
        buttonsDiv.appendChild(deleteBTN);
        
        li.appendChild(span);
        li.appendChild(prioritySpan);
        li.appendChild(buttonsDiv);
        taskList.appendChild(li);
    });
}

addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        priority: prioritySelect ? prioritySelect.value : "Medium"
    };

    tasks.push(newTask);
    saveTasks();
    render();

    taskInput.value = '';
});

if (searchInput) {
    searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value;
        render();
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter;
        
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        render();
    });
});
