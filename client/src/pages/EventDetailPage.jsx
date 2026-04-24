import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEvent, registerForEvent, getEventAttendees } from '../api/events';

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [registered, setRegistered] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getEvent(id).then(setEvent);
    getEventAttendees(id).then(setAttendees);
  }, [id]);

  const handleRegister = async () => {
    try {
      await registerForEvent(id);
      setRegistered(true);
      setMessage('You are registered!');
      getEventAttendees(id).then(setAttendees);
    } catch (err) {
      setMessage(err.message || 'Could not register');
    }
  };

  if (!event) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      <div className="detail-header">
        <div className="card-tag">{event.category}</div>
        <h1>{event.name}</h1>
        <p>{event.description}</p>
        <div className="event-meta">
          <span>📍 {event.location}</span>
          <span>📅 {event.date} at {event.time}</span>
          <span>{event.price > 0 ? `$${event.price}` : 'Free'}</span>
          <span>{attendees.length} registered</span>
        </div>
        {message && <p className="success">{message}</p>}
        {!registered && (
          <button className="btn" onClick={handleRegister}>Register for Event</button>
        )}
      </div>
    </div>
  );
}
