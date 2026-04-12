const db = require('../models/index');

const getAllClubs = (req, res) => {
    try {
        const clubs = db.prepare('SELECT * FROM clubs').all();
        res.json(clubs);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getClubById = (req, res) => {
    try {
        const club = db.prepare('SELECT * FROM clubs WHERE id = ?').get(req.params.id);
        if (!club) return res.status(404).json({ message: 'Club not found' });
        res.json(club);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createClub = (req, res) => {
    try {
        const { name, description, category, mission } = req.body;
        const result = db.prepare(
            'INSERT INTO clubs (name, description, category, mission, status) VALUES (?, ?, ?, ?, ?)'
        ).run(name, description, category, mission, 'pending');

        const clubId = result.lastInsertRowid;

        // auto-join petitioner as approved leader
        db.prepare(
            "INSERT INTO club_memberships (club_id, user_id, role, status) VALUES (?, ?, 'leader', 'approved')"
        ).run(clubId, req.user.id);

        res.status(201).json({ message: 'Club petition submitted', clubId });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateClub = (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });

        const { name, description, category, mission, status } = req.body;
        const club = db.prepare('SELECT id FROM clubs WHERE id = ?').get(req.params.id);
        if (!club) return res.status(404).json({ message: 'Club not found' });

        db.prepare(
            'UPDATE clubs SET name = ?, description = ?, category = ?, mission = ?, status = ? WHERE id = ?'
        ).run(name, description, category, mission, status, req.params.id);

        res.json({ message: 'Club updated' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteClub = (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });

        const club = db.prepare('SELECT id FROM clubs WHERE id = ?').get(req.params.id);
        if (!club) return res.status(404).json({ message: 'Club not found' });

        db.prepare('DELETE FROM clubs WHERE id = ?').run(req.params.id);
        res.json({ message: 'Club deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// admin approves or rejects a club petition
const approveMembership = (req, res) => {
    try {
        const { id, memberId } = req.params;

        if (memberId) {
            // club leadership approving a member
            const membership = db.prepare('SELECT * FROM club_memberships WHERE id = ? AND club_id = ?').get(memberId, id);
            if (!membership) return res.status(404).json({ message: 'Membership not found' });

            db.prepare("UPDATE club_memberships SET status = 'approved' WHERE id = ?").run(memberId);
            return res.json({ message: 'Member approved' });
        }

        // admin approving a club petition
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });

        const club = db.prepare('SELECT id FROM clubs WHERE id = ?').get(id);
        if (!club) return res.status(404).json({ message: 'Club not found' });

        db.prepare("UPDATE clubs SET status = 'approved' WHERE id = ?").run(id);
        res.json({ message: 'Club approved' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const rejectMembership = (req, res) => {
    try {
        const { id, memberId } = req.params;

        if (memberId) {
            const membership = db.prepare('SELECT * FROM club_memberships WHERE id = ? AND club_id = ?').get(memberId, id);
            if (!membership) return res.status(404).json({ message: 'Membership not found' });

            db.prepare("UPDATE club_memberships SET status = 'rejected' WHERE id = ?").run(memberId);
            return res.json({ message: 'Member rejected' });
        }

        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });

        const club = db.prepare('SELECT id FROM clubs WHERE id = ?').get(id);
        if (!club) return res.status(404).json({ message: 'Club not found' });

        db.prepare("UPDATE clubs SET status = 'rejected' WHERE id = ?").run(id);
        res.json({ message: 'Club rejected' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const joinClub = (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const club = db.prepare('SELECT id FROM clubs WHERE id = ?').get(id);
        if (!club) return res.status(404).json({ message: 'Club not found' });

        const existing = db.prepare('SELECT id FROM club_memberships WHERE club_id = ? AND user_id = ?').get(id, userId);
        if (existing) return res.status(400).json({ message: 'Already a member or request pending' });

        db.prepare('INSERT INTO club_memberships (club_id, user_id) VALUES (?, ?)').run(id, userId);
        res.status(201).json({ message: 'Join request submitted' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getClubMembers = (req, res) => {
    try {
        const members = db.prepare(`
            SELECT u.id, u.firstName, u.lastName, u.email, cm.role, cm.status
            FROM club_memberships cm
            JOIN users u ON u.id = cm.user_id
            WHERE cm.club_id = ?
        `).all(req.params.id);
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const removeMember = (req, res) => {
    try {
        const { id, memberId } = req.params;
        const membership = db.prepare('SELECT * FROM club_memberships WHERE id = ? AND club_id = ?').get(memberId, id);
        if (!membership) return res.status(404).json({ message: 'Membership not found' });

        db.prepare('DELETE FROM club_memberships WHERE id = ?').run(memberId);
        res.json({ message: 'Member removed' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getClubPosts = (req, res) => {
    try {
        const posts = db.prepare(`
            SELECT p.*, u.firstName, u.lastName
            FROM posts p
            JOIN users u ON u.id = p.user_id
            WHERE p.club_id = ?
            ORDER BY p.created_at DESC
        `).all(req.params.id);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createClubPost = (req, res) => {
    try {
        const { title, body } = req.body;
        const result = db.prepare(
            'INSERT INTO posts (club_id, user_id, title, body) VALUES (?, ?, ?, ?)'
        ).run(req.params.id, req.user.id, title, body);

        res.status(201).json({ message: 'Post created', postId: result.lastInsertRowid });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateClubPost = (req, res) => {
    try {
        const { postId } = req.params;
        const { title, body } = req.body;

        const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.user_id !== req.user.id) return res.status(403).json({ message: 'Not your post' });

        db.prepare('UPDATE posts SET title = ?, body = ? WHERE id = ?').run(title, body, postId);
        res.json({ message: 'Post updated' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteClubPost = (req, res) => {
    try {
        const { postId } = req.params;

        const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        db.prepare('DELETE FROM posts WHERE id = ?').run(postId);
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAllClubs, getClubById, createClub, updateClub, deleteClub,
    approveMembership, rejectMembership, joinClub, getClubMembers, removeMember,
    getClubPosts, createClubPost, updateClubPost, deleteClubPost
};
