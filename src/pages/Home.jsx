import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Timer, 
  BarChart3, 
  Trophy,
  Target,
  TrendingUp,
  Shield,
  ArrowRight
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { CircularProgress } from '../components/ProgressBar'
import { ROUTES } from '../utils/constants'

/**
 * Home Page / Dashboard
 * Main landing page showing overview stats and quick actions
 */
function Home() {
  const { stats, isLoading, examHistory } = useApp()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-primary"></div>
      </div>
    )
  }

  // Calculate recent performance
  const recentExams = examHistory.slice(0, 5)
  const recentAverage = recentExams.length > 0
    ? Math.round(recentExams.reduce((sum, e) => sum + e.score, 0) / recentExams.length)
    : 0

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          Welcome to <span className="gradient-text">CSA Exam Simulator</span>
        </h1>
        <p className="text-cyber-muted text-lg">
          Master cybersecurity concepts with 100 practice questions
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Total Questions"
          value={stats.totalQuestions}
          color="text-cyber-primary"
        />
        <StatCard
          icon={Trophy}
          label="Exams Taken"
          value={stats.examsTaken}
          color="text-emerald-400"
        />
        <StatCard
          icon={Target}
          label="Best Score"
          value={`${stats.bestScore}%`}
          color="text-amber-400"
        />
        <StatCard
          icon={TrendingUp}
          label="Average Score"
          value={`${stats.averageScore}%`}
          color="text-cyber-secondary"
        />
      </div>

      {/* Main Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Practice Mode Card */}
        <ActionCard
          title="Practice Mode"
          description="Study at your own pace with customizable filters. Review explanations and track your progress."
          icon={BookOpen}
          to={ROUTES.PRACTICE}
          color="from-cyber-primary to-cyan-600"
          features={[
            'Category-based filtering',
            'Instant feedback with explanations',
            'Flag questions for review',
            'Track your weak areas'
          ]}
        />

        {/* Exam Mode Card */}
        <ActionCard
          title="Exam Mode"
          description="Simulate the real exam experience with 50 random questions and a 60-minute timer."
          icon={Timer}
          to={ROUTES.EXAM}
          color="from-cyber-secondary to-violet-600"
          features={[
            '50 random questions',
            '60-minute countdown timer',
            'Detailed score report',
            'Review incorrect answers'
          ]}
        />
      </div>

      {/* Progress Section */}
      {stats.examsTaken > 0 && (
        <div className="bg-cyber-card rounded-xl p-6 border border-cyber-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyber-primary" />
              Your Progress
            </h2>
            <Link 
              to={ROUTES.ANALYTICS}
              className="text-cyber-primary hover:text-cyber-primary/80 flex items-center gap-1 text-sm"
            >
              View Details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Overall Progress */}
            <div className="flex flex-col items-center">
              <CircularProgress 
                percentage={stats.averageScore} 
                size={120}
                color={stats.averageScore >= 70 ? '#10b981' : '#06b6d4'}
              />
              <p className="mt-3 text-cyber-muted text-sm">Overall Average</p>
            </div>

            {/* Recent Performance */}
            <div className="flex flex-col items-center">
              <CircularProgress 
                percentage={recentAverage} 
                size={120}
                color={recentAverage >= 70 ? '#10b981' : '#f59e0b'}
              />
              <p className="mt-3 text-cyber-muted text-sm">Recent (Last 5)</p>
            </div>

            {/* Stats Summary */}
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-cyber-bg rounded-lg">
                <span className="text-cyber-muted">Total Exams</span>
                <span className="text-white font-bold">{stats.examsTaken}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-cyber-bg rounded-lg">
                <span className="text-cyber-muted">Best Score</span>
                <span className="text-emerald-400 font-bold">{stats.bestScore}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-cyber-bg rounded-lg">
                <span className="text-cyber-muted">Passing Rate</span>
                <span className="text-cyber-primary font-bold">
                  {Math.round((examHistory.filter(e => e.score >= 70).length / stats.examsTaken) * 100) || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Getting Started */}
      {stats.examsTaken === 0 && (
        <div className="bg-gradient-to-r from-cyber-primary/10 to-cyber-secondary/10 rounded-xl p-6 border border-cyber-primary/20">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-cyber-primary/20 rounded-lg">
              <Shield className="w-6 h-6 text-cyber-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Getting Started</h3>
              <p className="text-cyber-muted mb-4">
                New to the CSA Exam Simulator? Here is how to make the most of your practice:
              </p>
              <ul className="space-y-2 text-cyber-muted">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-primary"></span>
                  Start with <strong className="text-white">Practice Mode</strong> to learn at your own pace
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-primary"></span>
                  Review explanations for every question you get wrong
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-primary"></span>
                  Take <strong className="text-white">Exam Mode</strong> when you are ready to simulate the real test
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-primary"></span>
                  Check <strong className="text-white">Analytics</strong> to track your weak areas
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Stat Card Component
 */
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-cyber-card rounded-xl p-4 border border-cyber-border card-hover">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-cyber-bg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-cyber-muted">{label}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Action Card Component
 */
function ActionCard({ title, description, icon: Icon, to, color, features }) {
  return (
    <Link 
      to={to}
      className="group block bg-cyber-card rounded-xl border border-cyber-border overflow-hidden card-hover"
    >
      <div className={`h-2 bg-gradient-to-r ${color}`} />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-10`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <ArrowRight className="w-6 h-6 text-cyber-muted group-hover:text-cyber-primary group-hover:translate-x-1 transition-all" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-cyber-muted text-sm mb-4">{description}</p>
        
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-cyber-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-primary"></span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  )
}

export default Home
