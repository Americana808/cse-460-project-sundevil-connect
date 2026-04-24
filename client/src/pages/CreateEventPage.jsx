import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createEvent } from '../api/events';
import { getClubs } from '../api/clubs';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedClubId = searchParams.get('club_id');

  const [clubs, setClubs] = useState([]);
  const [form, setForm] = useState({ club_id: preselectedClubId || '', name: '', description: '', location: '', date: '', time: '', category: '', price: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getClubs().then(data => {
      const approved = data.filter(c => c.status === 'approved');
      setClubs(approved);
      // only default to first club if no club was pre-selected
      if (!preselectedClubId && approved.length > 0) {
        setForm(f => ({ ...f, club_id: approved[0].id }));
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createEvent({ ...form, price: parseFloat(form.price) || 0 });
      navigate(preselectedClubId ? `/clubs/${preselectedClubId}` : '/events');
    } catch (err) {
      setError(err.message || 'Could not create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="form-page">
        <h1>Create Event</h1>
        <form onSubmit={handleSubmit}>
          <label>Club</label>
          <select value={form.club_id} onChange={e => setForm({ ...form, club_id: e.target.value })} required>
            {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <label>Event Name</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <label>Category</label>
          <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <label>Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
          <label>Location</label>
          <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          <div className="form-row">
            <div>
              <label>Date</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label>Time</label>
              <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
            </div>
          </div>
          <label>Price ($)</label>
          <input type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
}
