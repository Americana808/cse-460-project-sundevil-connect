import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../api/events';
import { useAuth } from '../hooks/useAuth';
import EventCard from '../components/EventCard';

const CATEGORIES = ['All', 'Music', 'Tech', 'Sports', 'Social', 'Career', 'Academic', 'Arts', 'Other'];

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'free' | 'paid'
  const [dateFilter, setDateFilter] = useState('');      // date string YYYY-MM-DD
  const [sortBy, setSortBy] = useState('date');          // 'date' | 'popularity'

  useEffect(() => {
    getEvents().then(setEvents).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...events];

    // text search — name or location
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(q) ||
        (e.location && e.location.toLowerCase().includes(q)) ||
        (e.description && e.description.toLowerCase().includes(q))
      );
    }

    // category filter
    if (category !== 'All') {
      result = result.filter(e => e.category?.toLowerCase() === category.toLowerCase());
    }

    // free / paid filter
    if (priceFilter === 'free') result = result.filter(e => !e.price || e.price === 0);
    if (priceFilter === 'paid') result = result.filter(e => e.price > 0);

    // date filter — show events on or after selected date
    if (dateFilter) {
      result = result.filter(e => e.date && e.date >= dateFilter);
    }

    // sort
    if (sortBy === 'popularity') {
      result.sort((a, b) => (b.attendee_count || 0) - (a.attendee_count || 0));
    } else {
      result.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return a.date.localeCompare(b.date);
      });
    }

    return result;
  }, [events, search, category, priceFilter, dateFilter, sortBy]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Events</h1>
        {['club_leader', 'admin'].includes(user?.role) && (
          <Link to="/events/new" className="btn">+ Create Event</Link>
        )}
      </div>

      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, location, or description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category pills */}
      <div className="filter-pills">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`pill ${category === cat ? 'pill-active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Secondary filters */}
      <div className="filter-row">
        <div className="filter-group">
          <label>Price</label>
          <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div className="filter-group">
          <label>From date</label>
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Sort by</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="date">Date (soonest)</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>

        {(search || category !== 'All' || priceFilter !== 'all' || dateFilter) && (
          <button className="btn-secondary" onClick={() => {
            setSearch(''); setCategory('All'); setPriceFilter('all'); setDateFilter(''); setSortBy('date');
          }}>
            Clear filters
          </button>
        )}
      </div>

      {loading && <p>Loading...</p>}
      {!loading && filtered.length === 0 && <p>No events match your filters.</p>}
      <div className="grid">
        {filtered.map(event => <EventCard key={event.id} event={event} />)}
      </div>
    </div>
  );
}
