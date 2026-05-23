const leads = [
    { id: 1, name: "Иван", course: "JavaScript", budget: 30000, status: "new" },
    { id: 2, name: "Анна", course: "Python", budget: 45000, status: "inWork" },
    { id: 3, name: "Максим", course: "AI", budget: 70000, status: "hot" },
    { id: 4, name: "Елена", course: "JavaScript", budget: 25000, status: "closed" },
    { id: 5, name: "Олег", course: "AI", budget: 90000, status: "hot" }
];
  
let currentLeads = [...leads];
let searchQuery = "";
let currentCourseFilter = "all";

function getStatusRu(status) {
    const map = {
        new: "Новый",
        inWork: "В работе",
        hot: "Горячий",
        closed: "Закрыт"
    };
    return map[status] || status;
}

function escapeHtml(str) {
    if (!str) return "";
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function editLeadById(id) {
    const lead = currentLeads.find(l => l.id === id);
    if (!lead) return;

    let newName = prompt("Введите новое имя:", lead.name);
    if (newName !== null && newName.trim() !== "") lead.name = newName.trim();

    let newCourse = prompt("Введите курс:", lead.course);
    if (newCourse !== null && newCourse.trim() !== "") lead.course = newCourse.trim();

    let newBudget = prompt("Введите бюджет:", lead.budget);
    if (newBudget !== null && !isNaN(parseFloat(newBudget))) lead.budget = parseFloat(newBudget);

    let newStatus = prompt("Введите статус (new/inWork/hot/closed):", lead.status);
    if (newStatus !== null && ["new", "inWork", "hot", "closed"].includes(newStatus.trim())) {
        lead.status = newStatus.trim();
    }

    render();
}

function render() {
    let filtered = currentLeads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCourse = currentCourseFilter === "all" || lead.course === currentCourseFilter;
        return matchesSearch && matchesCourse;
    });

    const container = document.getElementById("cardsContainer");
    container.innerHTML = "";

    document.getElementById("leadsCount").textContent = filtered.length;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state">Ничего не найдено</div>`;
        return;
    }

    filtered.forEach(lead => {
        const card = document.createElement("div");
        card.className = `lead-card`;
        card.innerHTML = `
            <h3>${escapeHtml(lead.name)}</h3>
            <p><strong>Курс:</strong> ${escapeHtml(lead.course)}</p>
            <p><strong>Бюджет:</strong> ${lead.budget.toLocaleString()} руб.</p>
            <p><strong>Статус:</strong> ${getStatusRu(lead.status)}</p>
            <button class="edit-btn" data-id="${lead.id}">Редактировать</button>
        `;
        container.appendChild(card);
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.getAttribute('data-id'));
            editLeadById(id);
        });
    });
}

function sortByName() {
    currentLeads.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    render();
}

function sortByBudget() {
    currentLeads.sort((a, b) => a.budget - b.budget);
    render();
}

function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        render();
    });
}

function setupCourseFilter() {
    const courseFilter = document.getElementById("courseFilter");
    if (courseFilter) {
        courseFilter.addEventListener("change", (e) => {
            currentCourseFilter = e.target.value;
            render();
        });
    }
}

function init() {
    render();
    setupSearch();
    setupCourseFilter();
    document.getElementById("sortNameBtn").addEventListener("click", sortByName);
    document.getElementById("sortBudgetBtn").addEventListener("click", sortByBudget);
}

init();