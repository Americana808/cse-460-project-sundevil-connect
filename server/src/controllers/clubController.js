const db = require('../mdoels/index');

//get all clubs
const getAllClubs = async (req, res) => {
    try {
        const clubs = db.prepare('SELECT * FROM clubs').all();
        res.json(clubs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve clubs' });
    }
}

module.exports = {
    getAllClubs,
}