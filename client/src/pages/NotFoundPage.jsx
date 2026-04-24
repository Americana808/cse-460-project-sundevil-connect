import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/clubs" className="btn">Go Home</Link>
    </div>
  );
}
