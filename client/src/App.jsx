import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { ProtectedRoute } from './components/ProtectedRoute'
import Navbar from './components/Navbar'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ClubsPage from './pages/ClubsPage'
import ClubDetailPage from './pages/ClubDetailPage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import CreateClubPage from './pages/CreateClubPage'
import CreateEventPage from './pages/CreateEventPage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const { user, ready } = useAuth()
  if (!ready) return null

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to={user ? '/clubs' : '/login'} replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/clubs" element={<ProtectedRoute><ClubsPage /></ProtectedRoute>} />
        <Route path="/clubs/new" element={<ProtectedRoute><CreateClubPage /></ProtectedRoute>} />
        <Route path="/clubs/:id" element={<ProtectedRoute><ClubDetailPage /></ProtectedRoute>} />

        <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
        <Route path="/events/new" element={<ProtectedRoute roles={['club_leader', 'admin']}><CreateEventPage /></ProtectedRoute>} />
        <Route path="/events/:id" element={<ProtectedRoute><EventDetailPage /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminPage /></ProtectedRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
