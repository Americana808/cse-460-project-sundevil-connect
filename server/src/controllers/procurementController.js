const db = require('../models/index');

const getAllProcurements = (req, res) => {
    try {
        if (!['advisor', 'admin'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Advisors only' });
        }
        const requests = db.prepare('SELECT * FROM procurement_requests').all();
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createProcurement = (req, res) => {
    try {
        if (!['club_leader', 'admin'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Club leaders only' });
        }
        const { club_id, amount, description } = req.body;
        const result = db.prepare(
            'INSERT INTO procurement_requests (club_id, user_id, amount, description) VALUES (?, ?, ?, ?)'
        ).run(club_id, req.user.id, amount, description);

        res.status(201).json({ message: 'Procurement request submitted', requestId: result.lastInsertRowid });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const approveProcurement = (req, res) => {
    try {
        if (!['advisor', 'admin'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Advisors only' });
        }
        const request = db.prepare('SELECT id FROM procurement_requests WHERE id = ?').get(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        db.prepare("UPDATE procurement_requests SET status = 'approved' WHERE id = ?").run(req.params.id);
        res.json({ message: 'Procurement request approved' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const rejectProcurement = (req, res) => {
    try {
        if (!['advisor', 'admin'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Advisors only' });
        }
        const request = db.prepare('SELECT id FROM procurement_requests WHERE id = ?').get(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        db.prepare("UPDATE procurement_requests SET status = 'rejected' WHERE id = ?").run(req.params.id);
        res.json({ message: 'Procurement request rejected' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getAllProcurements, createProcurement, approveProcurement, rejectProcurement };
