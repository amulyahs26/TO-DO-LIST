let todos = []; // Array to hold todos for the logged-in user
let currentUser = null;
let filter = 'all';

// Authentication functions
function showSignup() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('signup-page').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('signup-page').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
}

function login() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        document.getElementById('user-name').textContent = `Welcome, ${currentUser.username}`;
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('todo-container').classList.remove('hidden');

        // Load the user's todos from localStorage
        loadTodos();
    } else {
        alert('Invalid email or password!');
    }
}

function signup() {
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const confirmPassword = document.getElementById('signup-confirm-password').value.trim();

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Check if the email already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
        alert('Email already registered!');
        return;
    }

    // Save new user
    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Initialize empty todos for the new user
    const todos = JSON.parse(localStorage.getItem('todos')) || {};
    todos[email] = [];
    localStorage.setItem('todos', JSON.stringify(todos));

    alert('Signup successful! Please log in.');
    showLogin();
}

function logout() {
    currentUser = null;
    todos = [];
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('todo-container').classList.add('hidden');
}

// Todo-related functions
function addTask() {
    const newTodo = document.getElementById('new-todo').value.trim();

    if (newTodo) {
        todos.push({ text: newTodo, completed: false });

        // Save the updated todos for the current user in localStorage
        const allTodos = JSON.parse(localStorage.getItem('todos')) || {};
        allTodos[currentUser.email] = todos; // Save the user's todos based on their email
        localStorage.setItem('todos', JSON.stringify(allTodos));

        document.getElementById('new-todo').value = ''; // Clear the input
        renderTodos();
    }
}

function deleteTask(index) {
    todos.splice(index, 1);

    // Save the updated todos in localStorage
    const allTodos = JSON.parse(localStorage.getItem('todos')) || {};
    allTodos[currentUser.email] = todos;
    localStorage.setItem('todos', JSON.stringify(allTodos));

    renderTodos();
}

function toggleCompletion(index) {
    todos[index].completed = !todos[index].completed;

    // Save the updated todos in localStorage
    const allTodos = JSON.parse(localStorage.getItem('todos')) || {};
    allTodos[currentUser.email] = todos;
    localStorage.setItem('todos', JSON.stringify(allTodos));

    renderTodos();
}

function setFilter(newFilter) {
    filter = newFilter;
    renderTodos();
}

function renderTodos() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

    let filteredTodos = todos;
    if (filter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    filteredTodos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.classList.add(todo.completed ? 'completed' : 'active');

        // Create a checkbox for completion
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.onchange = () => toggleCompletion(index);
        li.appendChild(checkbox);

        // Create a span to hold the task text
        const text = document.createElement('span');
        text.textContent = todo.text;
        text.contentEditable = true; // Make the text editable
        text.onblur = () => updateTask(index, text.textContent);
        li.appendChild(text);

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTask(index);
        li.appendChild(deleteButton);

        todoList.appendChild(li);
    });
}

function updateTask(index, newText) {
    todos[index].text = newText;

    // Save the updated todos in localStorage
    const allTodos = JSON.parse(localStorage.getItem('todos')) || {};
    allTodos[currentUser.email] = todos;
    localStorage.setItem('todos', JSON.stringify(allTodos));

    renderTodos();
}

function loadTodos() {
    const allTodos = JSON.parse(localStorage.getItem('todos')) || {};
    todos = allTodos[currentUser.email] || [];
    renderTodos();
}

// On page load, check if user is logged in and restore the todos
document.addEventListener('DOMContentLoaded', () => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
        currentUser = storedUser;
        document.getElementById('user-name').textContent = `Welcome, ${currentUser.username}`;
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('todo-container').classList.remove('hidden');

        // Load todos from localStorage
        loadTodos();
    }
});
