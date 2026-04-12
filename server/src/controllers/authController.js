const db = require('../models/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// register
const register = (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (existing) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const result = db.prepare('INSERT INTO users (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)').run(firstName, lastName, email, hashedPassword, role || 'student');

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: result.lastInsertRowid,
                firstName,
                lastName,
                email,
                role: role || 'student'
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

//login
const login = (req, res) => {
    try {
        const { email, password } = req.body;

        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
}

//logout
const logout = (req, res) => {
    res.json({ message: 'Logout successful' });
}

module.exports = {register, login, logout};