const db = require('../models/index');

const getAllFlags = (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
        const flags = db.prepare('SELECT * FROM flag_reports').all();
        res.json(flags);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createFlag = (req, res) => {
    try {
        const { content_type, content_id, reason } = req.body;
        const result = db.prepare(
            'INSERT INTO flag_reports (user_id, content_type, content_id, reason) VALUES (?, ?, ?, ?)'
        ).run(req.user.id, content_type, content_id, reason);

        res.status(201).json({ message: 'Content flagged', flagId: result.lastInsertRowid });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const resolveFlag = (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });

        const flag = db.prepare('SELECT id FROM flag_reports WHERE id = ?').get(req.params.id);
        if (!flag) return res.status(404).json({ message: 'Flag not found' });

        db.prepare("UPDATE flag_reports SET status = 'resolved' WHERE id = ?").run(req.params.id);
        res.json({ message: 'Flag resolved' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getAllFlags, createFlag, resolveFlag };
