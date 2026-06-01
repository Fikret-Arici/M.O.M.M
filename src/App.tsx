import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Layout } from './components/layout/Layout'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Topics from './pages/Topics'
import TopicDetail from './pages/TopicDetail'
import StudyMode from './pages/StudyMode'
import ReviewMode from './pages/ReviewMode'
import Statistics from './pages/Statistics'
import Tasks from './pages/Tasks'
import { PageSpinner } from './components/ui/Spinner'

function AppRoutes() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageSpinner />
      </div>
    )
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    )
  }

  return (
    <Layout onSignOut={signOut} userEmail={user.email}>
      <Routes>
        <Route path="/"                     element={<Navigate to="/dashboard" replace />} />
        <Route path="/auth"                 element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"            element={<Dashboard userId={user.id} />} />
        <Route path="/topics"               element={<Topics userId={user.id} />} />
        <Route path="/topics/:topicId"      element={<TopicDetail userId={user.id} />} />
        <Route path="/topics/:topicId/study" element={<StudyMode userId={user.id} />} />
        <Route path="/review"               element={<ReviewMode userId={user.id} />} />
        <Route path="/tasks"                element={<Tasks userId={user.id} />} />
        <Route path="/statistics"           element={<Statistics userId={user.id} />} />
        <Route path="*"                     element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
