import { useState, useMemo } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  Award,
  RotateCcw
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAnalytics } from '../hooks/useAnalytics'
import { CircularProgress } from '../components/ProgressBar'
import { CATEGORY_COLORS } from '../utils/constants'

/**
 * Analytics Page
 * Comprehensive performance analytics and insights
 */
function Analytics() {
  const { examHistory, practiceProgress, questions, resetAllData } = useApp()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  
  const analytics = useAnalytics(examHistory, practiceProgress)

  // Calculate category distribution
  const categoryDistribution = useMemo(() => {
    const distribution = {}
    questions.forEach(q => {
      distribution[q.category] = (distribution[q.category] || 0) + 1
    })
    return Object.entries(distribution)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
  }, [questions])

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (examHistory.length === 0 && Object.keys(practiceProgress.answers).length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="p-8 bg-cyber-card rounded-xl border border-cyber-border">
          <BarChart3 className="w-16 h-16 text-cyber-muted mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">No Data Available</h2>
          <p className="text-cyber-muted mb-6">
            Start practicing or take an exam to see your analytics here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-cyber-muted">Track your progress and identify weak areas</p>
        </div>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Data
        </button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          label="Average Score"
          value={`${analytics.overallStats.averageScore}%`}
          color="text-cyber-primary"
        />
        <StatCard
          icon={Award}
          label="Best Score"
          value={`${analytics.overallStats.bestScore}%`}
          color="text-emerald-400"
        />
        <StatCard
          icon={CheckCircle}
          label="Total Correct"
          value={analytics.overallStats.correctAnswers}
          color="text-cyber-secondary"
        />
        <StatCard
          icon={TrendingUp}
          label="Current Streak"
          value={`${analytics.streaks.current}`}
          color="text-amber-400"
        />
      </div>

      {/* Performance Overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <div className="bg-cyber-card rounded-xl p-6 border border-cyber-border">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-cyber-primary" />
            Performance Overview
          </h3>
          <div className="flex items-center justify-center py-6">
            <CircularProgress 
              percentage={analytics.overallStats.accuracy}
              size={180}
              color={analytics.overallStats.accuracy >= 70 ? '#10b981' : '#06b6d4'}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-cyber-bg rounded-lg">
              <p className="text-2xl font-bold text-white">{analytics.overallStats.totalExams}</p>
              <p className="text-xs text-cyber-muted">Exams Taken</p>
            </div>
            <div className="text-center p-3 bg-cyber-bg rounded-lg">
              <p className="text-2xl font-bold text-white">{analytics.streaks.best}</p>
              <p className="text-xs text-cyber-muted">Best Streak</p>
            </div>
          </div>
        </div>

        {/* Weak Areas */}
        <div className="bg-cyber-card rounded-xl p-6 border border-cyber-border">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Areas for Improvement
          </h3>
          {analytics.weakAreas.length > 0 ? (
            <div className="space-y-3">
              {analytics.weakAreas.slice(0, 5).map((area, index) => (
                <div key={area.category} className="flex items-center gap-4">
                  <span className="text-cyber-muted w-6">{index + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-white">{area.category}</span>
                      <span className="text-sm text-red-400">{area.accuracy}%</span>
                    </div>
                    <div className="h-2 bg-cyber-bg rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${area.accuracy}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-cyber-muted">No weak areas identified!</p>
              <p className="text-sm text-cyber-muted">Keep up the good work.</p>
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-cyber-card rounded-xl p-6 border border-cyber-border">
        <h3 className="text-lg font-bold text-white mb-4">Category Breakdown</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryDistribution.slice(0, 9).map(({ category, count }) => {
            const stats = analytics.categoryStats[category]
            const accuracy = stats?.accuracy || 0
            
            return (
              <div key={category} className="p-4 bg-cyber-bg rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white truncate flex-1">{category}</span>
                  <span className={`text-sm font-bold ${
                    accuracy >= 70 ? 'text-emerald-400' : 
                    accuracy >= 50 ? 'text-amber-400' : 
                    'text-cyber-muted'
                  }`}>
                    {stats ? `${accuracy}%` : '-'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-cyber-muted">
                  <span>{count} questions</span>
                  {stats && (
                    <>
                      <span>•</span>
                      <span>{stats.correct}/{stats.total} correct</span>
                    </>
                  )}
                </div>
                {stats && (
                  <div className="mt-2 h-1.5 bg-cyber-border rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        accuracy >= 70 ? 'bg-emerald-500' : 
                        accuracy >= 50 ? 'bg-amber-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Exam History */}
      {examHistory.length > 0 && (
        <div className="bg-cyber-card rounded-xl p-6 border border-cyber-border">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyber-primary" />
            Recent Exam History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-cyber-border">
                  <th className="pb-3 text-sm font-medium text-cyber-muted">Date</th>
                  <th className="pb-3 text-sm font-medium text-cyber-muted">Score</th>
                  <th className="pb-3 text-sm font-medium text-cyber-muted">Correct</th>
                  <th className="pb-3 text-sm font-medium text-cyber-muted">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border">
                {examHistory.slice(0, 10).map((exam) => (
                  <tr key={exam.id} className="group">
                    <td className="py-3 text-sm text-white">
                      {formatDate(exam.date)}
                    </td>
                    <td className="py-3">
                      <span className={`text-sm font-bold ${
                        exam.score >= 70 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {exam.score}%
                      </span>
                    </td>
                    <td className="py-3 text-sm text-cyber-muted">
                      {exam.correctCount}/{exam.totalQuestions}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        exam.score >= 70 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {exam.score >= 70 ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analytics.recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-cyber-primary/10 to-cyber-secondary/10 rounded-xl p-6 border border-cyber-primary/20">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyber-primary" />
            Recommendations
          </h3>
          <div className="space-y-3">
            {analytics.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-cyber-bg/50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  rec.priority === 'high' ? 'bg-red-400' : 'bg-amber-400'
                }`} />
                <div>
                  <p className="text-white font-medium">{rec.message}</p>
                  <p className="text-sm text-cyber-muted">{rec.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-cyber-card rounded-xl p-6 max-w-md w-full border border-cyber-border animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Reset All Data?</h3>
            </div>
            
            <p className="text-cyber-muted mb-6">
              This will permanently delete all your exam history, practice progress, and analytics. This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 bg-cyber-border text-white rounded-lg hover:bg-cyber-border/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllData()
                  setShowResetConfirm(false)
                }}
                className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Reset All
              </button>
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
    <div className="bg-cyber-card rounded-xl p-4 border border-cyber-border">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-cyber-bg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-white">{value}</p>
          <p className="text-xs text-cyber-muted">{label}</p>
        </div>
      </div>
    </div>
  )
}

export default Analytics
