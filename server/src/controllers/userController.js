const db = require('../models/index');

const getUserProfile = (req, res) => {
    try {
        const user = db.prepare('SELECT id, firstName, lastName, email, role FROM users WHERE id = ?').get(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateUserProfile = (req, res) => {
    try {
        const { firstName, lastName } = req.body;
        const { id } = req.params;

        if (parseInt(id) !== req.user.id) {
            return res.status(403).json({ message: 'You can only update your own profile' });
        }

        const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        db.prepare('UPDATE users SET firstName = ?, lastName = ? WHERE id = ?').run(firstName, lastName, id);
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getUserProfile, updateUserProfile };
