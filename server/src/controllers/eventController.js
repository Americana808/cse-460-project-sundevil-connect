const db = require('../models/index');

const getAllEvents = (req, res) => {
    try {
        const events = db.prepare(`
            SELECT e.*, COUNT(er.id) as attendee_count
            FROM events e
            LEFT JOIN event_registrations er ON er.event_id = e.id
            GROUP BY e.id
        `).all();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getEventById = (req, res) => {
    try {
        const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createEvent = (req, res) => {
    try {
        if (!['club_leader', 'admin'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Club leaders only' });
        }
        const { club_id, name, description, location, date, time, category, price } = req.body;
        const result = db.prepare(
            'INSERT INTO events (club_id, name, description, location, date, time, category, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).run(club_id, name, description, location, date, time, category, price || 0);

        res.status(201).json({ message: 'Event created', eventId: result.lastInsertRowid });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateEvent = (req, res) => {
    try {
        if (!['club_leader', 'admin'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Club leaders only' });
        }
        const event = db.prepare('SELECT id FROM events WHERE id = ?').get(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const { name, description, location, date, time, category, price } = req.body;
        db.prepare(
            'UPDATE events SET name = ?, description = ?, location = ?, date = ?, time = ?, category = ?, price = ? WHERE id = ?'
        ).run(name, description, location, date, time, category, price, req.params.id);

        res.json({ message: 'Event updated' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteEvent = (req, res) => {
    try {
        if (!['club_leader', 'admin'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Club leaders only' });
        }
        const event = db.prepare('SELECT id FROM events WHERE id = ?').get(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const registerForEvent = (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const event = db.prepare('SELECT id FROM events WHERE id = ?').get(id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const existing = db.prepare('SELECT id FROM event_registrations WHERE event_id = ? AND user_id = ?').get(id, userId);
        if (existing) return res.status(400).json({ message: 'Already registered' });

        db.prepare('INSERT INTO event_registrations (event_id, user_id) VALUES (?, ?)').run(id, userId);
        res.status(201).json({ message: 'Registered for event' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const unregisterForEvent = (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const registration = db.prepare('SELECT id FROM event_registrations WHERE event_id = ? AND user_id = ?').get(id, userId);
        if (!registration) return res.status(404).json({ message: 'Registration not found' });

        db.prepare('DELETE FROM event_registrations WHERE event_id = ? AND user_id = ?').run(id, userId);
        res.json({ message: 'Unregistered from event' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getEventAttendees = (req, res) => {
    try {
        const attendees = db.prepare(`
            SELECT u.id, u.firstName, u.lastName, u.email
            FROM event_registrations er
            JOIN users u ON u.id = er.user_id
            WHERE er.event_id = ?
        `).all(req.params.id);
        res.json(attendees);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAllEvents, getEventById, createEvent, updateEvent, deleteEvent,
    registerForEvent, unregisterForEvent, getEventAttendees
};
