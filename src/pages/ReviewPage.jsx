import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Home,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Clock,
  Target,
  BarChart3
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { CompactOption, OptionLegend } from '../components/OptionButton'
import { CircularProgress } from '../components/ProgressBar'
import { ROUTES, EXAM_CONFIG } from '../utils/constants'

/**
 * Review Page
 * Shows exam results with detailed review of all questions
 */
function ReviewPage() {
  const navigate = useNavigate()
  const { currentExam, examHistory } = useApp()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filter, setFilter] = useState('all') // all, correct, incorrect, unanswered

  // Get the most recent exam if currentExam is not available
  const exam = currentExam?.status === 'completed' 
    ? currentExam 
    : examHistory[0]

  if (!exam) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="p-8 bg-cyber-card rounded-xl border border-cyber-border">
          <h2 className="text-2xl font-bold text-white mb-4">No Exam Results</h2>
          <p className="text-cyber-muted mb-6">
            You haven't completed any exams yet. Take an exam to see your results here.
          </p>
          <button
            onClick={() => navigate(ROUTES.EXAM)}
            className="px-6 py-3 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary/90 transition-colors"
          >
            Take Exam
          </button>
        </div>
      </div>
    )
  }

  const { questions, answers, score, correctCount, totalQuestions, startTime, endTime } = exam

  // Calculate exam duration
  const duration = startTime && endTime 
    ? Math.round((endTime - startTime) / 60000)
    : 0

  // Filter questions
  const getFilteredQuestions = () => {
    switch (filter) {
      case 'correct':
        return questions.filter(q => answers[q.id]?.isCorrect)
      case 'incorrect':
        return questions.filter(q => answers[q.id] && !answers[q.id].isCorrect)
      case 'unanswered':
        return questions.filter(q => !answers[q.id])
      default:
        return questions
    }
  }

  const filteredQuestions = getFilteredQuestions()
  const currentQuestion = filteredQuestions[currentIndex]

  // Navigation
  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  // Performance level
  const getPerformanceLevel = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500/20' }
    if (score >= 75) return { label: 'Good', color: 'text-cyber-primary', bg: 'bg-cyber-primary/20' }
    if (score >= 60) return { label: 'Average', color: 'text-amber-400', bg: 'bg-amber-500/20' }
    return { label: 'Needs Improvement', color: 'text-red-400', bg: 'bg-red-500/20' }
  }

  const performance = getPerformanceLevel(score)
  const passed = score >= EXAM_CONFIG.PASSING_SCORE_PERCENT

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Exam Review</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(ROUTES.EXAM)}
            className="flex items-center gap-2 px-4 py-2 bg-cyber-card text-white rounded-lg border border-cyber-border hover:border-cyber-primary transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retake
          </button>
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="flex items-center gap-2 px-4 py-2 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        </div>
      </div>

      {/* Score Summary */}
      <div className="bg-cyber-card rounded-xl p-6 border border-cyber-border">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Score Circle */}
          <div className="flex flex-col items-center justify-center">
            <CircularProgress 
              percentage={score} 
              size={140}
              color={passed ? '#10b981' : '#ef4444'}
            />
            <div className={`mt-3 px-3 py-1 rounded-full text-sm font-medium ${performance.bg} ${performance.color}`}>
              {performance.label}
            </div>
          </div>

          {/* Stats */}
          <div className="md:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatBox
              icon={Target}
              label="Score"
              value={`${score}%`}
              color={passed ? 'text-emerald-400' : 'text-red-400'}
            />
            <StatBox
              icon={CheckCircle}
              label="Correct"
              value={`${correctCount}/${totalQuestions}`}
              color="text-emerald-400"
            />
            <StatBox
              icon={XCircle}
              label="Incorrect"
              value={`${totalQuestions - correctCount}`}
              color="text-red-400"
            />
            <StatBox
              icon={Clock}
              label="Duration"
              value={`${duration} min`}
              color="text-cyber-primary"
            />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All Questions', count: questions.length },
          { key: 'correct', label: 'Correct', count: Object.values(answers).filter(a => a.isCorrect).length },
          { key: 'incorrect', label: 'Incorrect', count: Object.values(answers).filter(a => a && !a.isCorrect).length },
          { key: 'unanswered', label: 'Unanswered', count: questions.length - Object.keys(answers).length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => {
              setFilter(key)
              setCurrentIndex(0)
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-cyber-primary text-white'
                : 'bg-cyber-card text-cyber-muted hover:text-white border border-cyber-border'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Legend */}
      <OptionLegend />

      {/* Question Review */}
      {filteredQuestions.length > 0 ? (
        <div className="space-y-4">
          {/* Question header */}
          <div className="flex items-center justify-between">
            <p className="text-cyber-muted">
              Showing {currentIndex + 1} of {filteredQuestions.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="p-2 rounded-lg bg-cyber-card border border-cyber-border text-cyber-muted hover:text-white disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === filteredQuestions.length - 1}
                className="p-2 rounded-lg bg-cyber-card border border-cyber-border text-cyber-muted hover:text-white disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Question card */}
          {currentQuestion && (
            <div className="bg-cyber-card rounded-xl border border-cyber-border overflow-hidden">
              {/* Question header */}
              <div className="px-6 py-4 border-b border-cyber-border bg-cyber-bg/50">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <span className="text-sm text-cyber-muted">
                    Question {questions.indexOf(currentQuestion) + 1} of {questions.length}
                  </span>
                  <span className="text-sm text-cyber-primary font-medium">
                    {currentQuestion.category}
                  </span>
                </div>
              </div>

              {/* Question content */}
              <div className="p-6">
                <h3 className="text-lg text-white mb-6 leading-relaxed">
                  {currentQuestion.question}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                  {Object.entries(currentQuestion.options).map(([key, text]) => {
                    const isSelected = answers[currentQuestion.id]?.answer === key
                    const isCorrect = currentQuestion.correctAnswer === key
                    
                    return (
                      <div
                        key={key}
                        className={`p-4 rounded-lg border-2 flex items-start gap-4 ${
                          isCorrect
                            ? 'bg-emerald-500/10 border-emerald-500/50'
                            : isSelected && !isCorrect
                            ? 'bg-red-500/10 border-red-500/50'
                            : 'bg-cyber-bg border-cyber-border'
                        }`}
                      >
                        <CompactOption
                          option={key}
                          isCorrect={isCorrect}
                          isSelected={isSelected}
                          showFeedback={true}
                        />
                        <p className={`flex-1 ${
                          isCorrect ? 'text-emerald-400' : 
                          isSelected ? 'text-red-400' : 
                          'text-cyber-muted'
                        }`}>
                          {text}
                        </p>
                        {isCorrect && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                        {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                      </div>
                    )
                  })}
                </div>

                {/* Explanation */}
                {currentQuestion.explanation && (
                  <div className="mt-6 p-4 bg-cyber-bg rounded-lg border border-cyber-border">
                    <h4 className="font-medium text-white mb-2">Explanation</h4>
                    <p className="text-cyber-muted leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-cyber-card rounded-xl border border-cyber-border">
          <p className="text-cyber-muted">No questions match the selected filter.</p>
        </div>
      )}
    </div>
  )
}

/**
 * Stat Box Component
 */
function StatBox({ icon: Icon, label, value, color }) {
  return (
    <div className="p-4 bg-cyber-bg rounded-lg text-center">
      <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-cyber-muted">{label}</p>
    </div>
  )
}

export default ReviewPage
