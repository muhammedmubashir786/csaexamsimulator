import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import PracticeMode from './pages/PracticeMode'
import ExamMode from './pages/ExamMode'
import ReviewPage from './pages/ReviewPage'
import Analytics from './pages/Analytics'

/**
 * Main App Component
 * Sets up the application context and routing
 * All routes are wrapped in the Layout component for consistent navigation
 */
function App() {
  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<PracticeMode />} />
          <Route path="/exam" element={<ExamMode />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Layout>
    </AppProvider>
  )
}

export default App
