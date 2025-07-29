const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
dotenv.config(); 
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); 
const users = [
    { username: 'admin', password: '$2a$10$Q/lc/JYXrfIZf7vOECxO8OoDndpt67n1/Ut5wZkUJ8pTQUHNh.9yO' }, // password is 'admin123'
];
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    });
});
app.get('/', (req, res) => {
    res.send('Attendance Management System API');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
