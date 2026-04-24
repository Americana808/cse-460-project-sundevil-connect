import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClub, joinClub, getClubPosts, createClubPost, getClubMembers, approveMember, rejectMember } from '../api/clubs';
import { getEvents } from '../api/events';
import { useAuth } from '../hooks/useAuth';
import EventCard from '../components/EventCard';

export default function ClubDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [club, setClub] = useState(null);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [joined, setJoined] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [message, setMessage] = useState('');

  const loadMembers = () => getClubMembers(id).then(data => {
    setMembers(data);
    const me = data.find(m => m.id === user?.id);
    if (me) setJoined(true);
  });

  useEffect(() => {
    getClub(id).then(setClub);
    getClubPosts(id).then(setPosts);
    getEvents().then(all => setEvents(all.filter(e => String(e.club_id) === String(id))));
    loadMembers();
  }, [id]);

  const handleJoin = async () => {
    try {
      await joinClub(id);
      setJoined(true);
      setMessage('Join request submitted!');
      loadMembers();
    } catch (err) {
      setMessage(err.message || 'Could not join club');
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await createClubPost(id, newPost);
      setNewPost({ title: '', body: '' });
      getClubPosts(id).then(setPosts);
    } catch (err) {
      setMessage(err.message || 'Could not create post');
    }
  };

  const handleApproveMember = async (memberId) => {
    await approveMember(id, memberId);
    loadMembers();
  };

  const handleRejectMember = async (memberId) => {
    await rejectMember(id, memberId);
    loadMembers();
  };

  const isLeader = members.some(m => m.id === user?.id && m.role === 'leader');
  const pendingMembers = members.filter(m => m.status === 'pending');
  const approvedMembers = members.filter(m => m.status === 'approved');

  if (!club) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      <div className="detail-header">
        <div className="card-tag">{club.category}</div>
        <h1>{club.name}</h1>
        <p>{club.description}</p>
        <p><em>{club.mission}</em></p>
        {message && <p className="success">{message}</p>}
        {!joined && (
          <button className="btn" onClick={handleJoin}>Join Club</button>
        )}
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Events</h2>
          {isLeader && (
            <Link to={`/events/new?club_id=${id}`} className="btn">+ Create Event</Link>
          )}
        </div>
        {events.length === 0 && <p>No events yet.</p>}
        <div className="grid">
          {events.map(event => <EventCard key={event.id} event={event} />)}
        </div>
      </div>

      <div className="section">
        <h2>Members ({approvedMembers.length})</h2>

        {/* Pending approvals — leaders only */}
        {isLeader && pendingMembers.length > 0 && (
          <div className="members-pending">
            <h3>Pending Requests ({pendingMembers.length})</h3>
            <div className="admin-list">
              {pendingMembers.map(m => (
                <div key={m.id} className="admin-item">
                  <div>
                    <strong>{m.firstName} {m.lastName}</strong>
                    <p>{m.email}</p>
                  </div>
                  <div className="admin-actions">
                    <button className="btn" onClick={() => handleApproveMember(m.id)}>Approve</button>
                    <button className="btn-danger" onClick={() => handleRejectMember(m.id)}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved members list */}
        <div className="members-list">
          {approvedMembers.map(m => (
            <div key={m.id} className="member-row">
              <span>{m.firstName} {m.lastName}</span>
              <span className="card-tag">{m.role}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>Posts</h2>
        {isLeader && (
          <form onSubmit={handlePost} className="post-form">
            <input
              placeholder="Post title"
              value={newPost.title}
              onChange={e => setNewPost({ ...newPost, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Post body"
              value={newPost.body}
              onChange={e => setNewPost({ ...newPost, body: e.target.value })}
              rows={3}
            />
            <button type="submit" className="btn">Post</button>
          </form>
        )}
        {posts.length === 0 && <p>No posts yet.</p>}
        <div className="posts-list">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <small>{post.firstName} {post.lastName} · {new Date(post.created_at).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
