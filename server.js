const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Dummy users database
const users = [];
let todos = {};

// Serve static files from the 'to-do-list' folder
app.use(express.static('To-do-list'));

// Serve index.html from the 'to-do-list' folder
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/To-do-list/index.html');
});

// Middleware
app.use(bodyParser.json());

app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(409).json({ success: false, message: "Email already registered!" });
    }

    users.push({ id: users.length + 1, username, email, password });
    todos[email] = []; // Initialize an empty todos list for this user
    res.status(201).json({ success: true, message: "Signup successful!" });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ success: false, message: "Invalid email or password!" });
    }

    res.json({
        success: true,
        user,
        todos: todos[email] || [],
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
