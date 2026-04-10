const db = require('../models/index');

// register
const register = (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        // check 
        const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (existing) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const result = db.prepare('INSERT INTO users (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)').run(firstName, lastName, email, password, role || 'student');

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: result.lastInsertRowid,
                firstName,
                lastName,
                email,
                role: role || 'student'
            }
        })
        
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

//login
const login = (req, res) => {
    try {
        const { email, password } = req.body;

        //find user
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) {
            return res.status(401).json({ message: 'User not found'});
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }

    //logout
    const logout = (res, req) => {
        res.json({ message: 'Logout successful' });
    }
}

module.exports = {register, login, logout};