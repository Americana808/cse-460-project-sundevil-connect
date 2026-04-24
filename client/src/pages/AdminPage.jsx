import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClubs, approveClub, rejectClub, deleteClub } from '../api/clubs';
import { getFlags, resolveFlag } from '../api/admin';

const STATUS_COLORS = { approved: '#27ae60', pending: '#e67e22', rejected: '#c0392b' };

export default function AdminPage() {
  const [tab, setTab] = useState('pending');
  const [allClubs, setAllClubs] = useState([]);
  const [flags, setFlags] = useState([]);

  const loadData = () => {
    getClubs().then(setAllClubs);
    getFlags().then(setFlags);
  };

  useEffect(() => { loadData(); }, []);

  const pendingClubs = allClubs.filter(c => c.status === 'pending');
  const approvedClubs = allClubs.filter(c => c.status === 'approved');
  const rejectedClubs = allClubs.filter(c => c.status === 'rejected');

  const handleApprove = async (id) => { await approveClub(id); loadData(); };
  const handleReject = async (id) => { await rejectClub(id); loadData(); };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this club? This cannot be undone.')) return;
    await deleteClub(id);
    loadData();
  };
  const handleResolveFlag = async (id) => { await resolveFlag(id); loadData(); };

  const tabs = [
    { key: 'pending', label: `Pending (${pendingClubs.length})` },
    { key: 'all', label: `All Clubs (${allClubs.length})` },
    { key: 'flags', label: `Flags (${flags.filter(f => f.status === 'pending').length})` },
  ];

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>

      {/* Tab bar */}
      <div className="tab-bar">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`tab ${tab === t.key ? 'tab-active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Pending petitions */}
      {tab === 'pending' && (
        <div className="section">
          {pendingClubs.length === 0 && <p>No pending petitions.</p>}
          <div className="admin-list">
            {pendingClubs.map(club => (
              <div key={club.id} className="admin-item">
                <div>
                  <strong>{club.name}</strong>
                  {club.category && <span className="card-tag">{club.category}</span>}
                  <p>{club.description}</p>
                  <p><em>{club.mission}</em></p>
                </div>
                <div className="admin-actions">
                  <button className="btn" onClick={() => handleApprove(club.id)}>Approve</button>
                  <button className="btn-danger" onClick={() => handleReject(club.id)}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All clubs oversight */}
      {tab === 'all' && (
        <div className="section">
          {allClubs.length === 0 && <p>No clubs yet.</p>}
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allClubs.map(club => (
                <tr key={club.id}>
                  <td>
                    {club.status === 'approved'
                      ? <Link to={`/clubs/${club.id}`}>{club.name}</Link>
                      : club.name}
                  </td>
                  <td>{club.category || '—'}</td>
                  <td>
                    <span className="status-badge" style={{ color: STATUS_COLORS[club.status] }}>
                      {club.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      {club.status === 'pending' && (
                        <>
                          <button className="btn" onClick={() => handleApprove(club.id)}>Approve</button>
                          <button className="btn-danger" onClick={() => handleReject(club.id)}>Reject</button>
                        </>
                      )}
                      {club.status === 'rejected' && (
                        <button className="btn" onClick={() => handleApprove(club.id)}>Re-approve</button>
                      )}
                      <button className="btn-danger" onClick={() => handleDelete(club.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="admin-stats">
            <div className="stat-card">
              <span className="stat-num">{allClubs.length}</span>
              <span>Total Clubs</span>
            </div>
            <div className="stat-card">
              <span className="stat-num" style={{ color: STATUS_COLORS.approved }}>{approvedClubs.length}</span>
              <span>Approved</span>
            </div>
            <div className="stat-card">
              <span className="stat-num" style={{ color: STATUS_COLORS.pending }}>{pendingClubs.length}</span>
              <span>Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-num" style={{ color: STATUS_COLORS.rejected }}>{rejectedClubs.length}</span>
              <span>Rejected</span>
            </div>
          </div>
        </div>
      )}

      {/* Flag reports */}
      {tab === 'flags' && (
        <div className="section">
          {flags.length === 0 && <p>No flags reported.</p>}
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Content ID</th>
                <th>Reason</th>
                <th>Reported</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {flags.map(flag => (
                <tr key={flag.id}>
                  <td>{flag.content_type}</td>
                  <td>{flag.content_id}</td>
                  <td>{flag.reason || '—'}</td>
                  <td>{flag.created_at ? new Date(flag.created_at).toLocaleDateString() : '—'}</td>
                  <td>
                    <span className="status-badge" style={{ color: flag.status === 'resolved' ? STATUS_COLORS.approved : STATUS_COLORS.pending }}>
                      {flag.status}
                    </span>
                  </td>
                  <td>
                    {flag.status === 'pending' && (
                      <button className="btn-secondary" onClick={() => handleResolveFlag(flag.id)}>Resolve</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
