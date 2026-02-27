// script.js — Adds dark mode toggle, smooth scroll, and form handling

// Toggle Dark Mode: add/remove 'dark-mode' class on <body>
const darkToggle = document.querySelector('#dark-toggle');
const body = document.body;

if (darkToggle) {
  // Initialize button text/aria based on current state
  darkToggle.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-mode');
    darkToggle.setAttribute('aria-pressed', String(isDark));
    // Optional: change button label to reflect state
    darkToggle.textContent = isDark ? 'Toggle Light Mode' : 'Toggle Dark Mode';
  });
}

// Smooth Scroll for nav links
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // prevent default jump
    const href = link.getAttribute('href');
    if (!href || href.charAt(0) !== '#') return;
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Contact form handling (no page reload)
const form = document.querySelector('form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // prevent page reload

    // Get the name input value
    const nameInput = form.querySelector('#name');
    const name = nameInput ? nameInput.value.trim() : '';

    // Create or update a confirmation message below the form
    let msgEl = document.querySelector('.form-message');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.className = 'form-message';
      form.insertAdjacentElement('afterend', msgEl);
    }

    // Insert message into DOM
    msgEl.textContent = `Halo ${name || 'Teman'}, pesan Anda berhasil terkirim!`;

    // Optionally clear the message after a few seconds
    setTimeout(() => {
      if (msgEl) msgEl.textContent = '';
    }, 4500);

    // Optionally reset the form fields (uncomment if you want this)
    // form.reset();
  });
}

/* -----------------------------------------------
   User Directory: Fetch users from API
   Uses async/await with error handling
   -------------------------------------------------*/

// Generate initials from user name
function getInitials(name) {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1) {
    return words[0][0].toUpperCase();
  }
  return '';
}

async function fetchAndDisplayUsers() {
  const container = document.getElementById('user-container');
  
  try {
    // Fetch data from the API
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    
    // Check if response is OK
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    // Parse JSON response
    const users = await response.json();
    
    // Display first 6 users
    const displayUsers = users.slice(0, 6);
    
    // Clear container and create user cards
    container.innerHTML = '';
    displayUsers.forEach(user => {
      const userCard = document.createElement('div');
      userCard.className = 'user-card';
      
      const initials = getInitials(user.name);
      
      userCard.innerHTML = `
        <div class="user-avatar">${initials}</div>
        <h3>${user.name}</h3>
        <div class="info-label">Email</div>
        <p class="info-value">${user.email}</p>
        <div class="info-label">Company</div>
        <p class="info-value">${user.company.name}</p>
      `;
      
      container.appendChild(userCard);
    });
    
  } catch (error) {
    // Handle errors without using alert()
    container.innerHTML = '<div class="user-error">Maaf, data gagal dimuat</div>';
    console.error('Error fetching users:', error);
  }
}

// Fetch users when page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayUsers);

/* ---------------------------------------------
   To-Do List Application
   - CRUD operations
   - filtering and persistence
----------------------------------------------*/
const taskInput = document.getElementById('new-task');
const addBtn = document.getElementById('add-task');
const taskListEl = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');
const counterEl = document.getElementById('task-counter');
const warningEl = document.getElementById('input-warning');

let tasks = [];
let currentFilter = 'all';

// load from localStorage
function loadTasks() {
  const data = localStorage.getItem('tasks');
  if (data) {
    try {
      tasks = JSON.parse(data);
    } catch (e) {
      tasks = [];
    }
  }
}

// save to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// render list based on current filter
function renderTasks() {
  taskListEl.innerHTML = '';
  const filtered = tasks.filter(t => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
  });

  filtered.forEach((task, index) => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
      tasks[index].completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const span = document.createElement('span');
    span.textContent = task.text;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Hapus';
    delBtn.className = 'delete-btn';
    delBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    taskListEl.appendChild(li);
  });

  updateCounter();
}

function updateCounter() {
  const count = tasks.length;
  counterEl.textContent = `${count} tugas`;
}

function showWarning(text) {
  warningEl.textContent = text;
  warningEl.classList.remove('hidden');
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    showWarning('Tugas tidak boleh kosong');
    return;
  }
  warningEl.classList.add('hidden');

  tasks.push({ text, completed: false });
  taskInput.value = '';
  saveTasks();
  renderTasks();
}

if (addBtn) {
  addBtn.addEventListener('click', addTask);
}
if (taskInput) {
  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

if (clearCompletedBtn) {
  clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
  });
}

// initialization
loadTasks();
renderTasks();
