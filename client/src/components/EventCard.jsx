import { Link } from 'react-router-dom';

export default function EventCard({ event }) {
  return (
    <div className="card">
      <div className="card-tag">{event.category}</div>
      <h3>{event.name}</h3>
      <p>{event.location} · {event.date} {event.time}</p>
      <div className="card-meta">
        <span>{event.price > 0 ? `$${event.price}` : 'Free'}</span>
        <span>👥 {event.attendee_count || 0} registered</span>
      </div>
      <Link to={`/events/${event.id}`} className="btn-secondary">View Event</Link>
    </div>
  );
}
