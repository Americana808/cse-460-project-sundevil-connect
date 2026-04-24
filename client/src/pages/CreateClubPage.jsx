import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClub } from '../api/clubs';

export default function CreateClubPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', category: '', mission: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createClub(form);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Could not submit petition');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page">
        <div className="auth-card">
          <h2>Petition Submitted!</h2>
          <p>Your club petition is pending admin approval.</p>
          <button className="btn" onClick={() => navigate('/clubs')}>Back to Clubs</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="form-page">
        <h1>Petition a New Club</h1>
        <form onSubmit={handleSubmit}>
          <label>Club Name</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <label>Category</label>
          <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Academic, Sports, Arts..." />
          <label>Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
          <label>Mission</label>
          <textarea value={form.mission} onChange={e => setForm({ ...form, mission: e.target.value })} rows={3} />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Petition'}
          </button>
        </form>
      </div>
    </div>
  );
}
