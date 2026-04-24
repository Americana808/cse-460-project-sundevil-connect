import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClubs } from '../api/clubs';
import ClubCard from '../components/ClubCard';

export default function ClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClubs()
      .then(data => setClubs(data.filter(c => c.status === 'approved')))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Clubs</h1>
        <Link to="/clubs/new" className="btn">+ Petition a Club</Link>
      </div>
      {loading && <p>Loading...</p>}
      {!loading && clubs.length === 0 && <p>No clubs yet. Be the first to petition one!</p>}
      <div className="grid">
        {clubs.map(club => <ClubCard key={club.id} club={club} />)}
      </div>
    </div>
  );
}
