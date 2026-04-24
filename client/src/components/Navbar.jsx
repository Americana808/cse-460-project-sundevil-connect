import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/clubs">SunDevil Connect</Link>
      </div>
      <div className="navbar-links">
        <Link to="/clubs">Clubs</Link>
        <Link to="/events">Events</Link>
        {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
      </div>
      <div className="navbar-user">
        <span>{user?.firstName} {user?.lastName}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
