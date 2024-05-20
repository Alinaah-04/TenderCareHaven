const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3002;

// In-memory database for user credentials (Replace this with a proper database in real-world scenario)
const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' }
];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if the username and password match
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Invalid username or password');
    }
});

// Start server
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:3002');
});