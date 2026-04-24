import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi, login as loginApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerApi(form);
      const data = await loginApi(form.email, form.password);
      login(data);
      navigate('/clubs');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>SunDevil Connect</h1>
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label>First Name</label>
              <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required />
            </div>
            <div>
              <label>Last Name</label>
              <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required />
            </div>
          </div>
          <label>Email</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <label>Password</label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <label>Role</label>
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="student">Student</option>
            <option value="club_leader">Club Leader</option>
          </select>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p>Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
