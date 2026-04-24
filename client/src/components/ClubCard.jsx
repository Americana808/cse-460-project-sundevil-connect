import { Link } from 'react-router-dom';

export default function ClubCard({ club }) {
  return (
    <div className="card">
      <div className="card-tag">{club.category}</div>
      <h3>{club.name}</h3>
      <p>{club.description}</p>
      <Link to={`/clubs/${club.id}`} className="btn-secondary">View Club</Link>
    </div>
  );
}
