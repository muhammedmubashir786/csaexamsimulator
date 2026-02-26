import { useState, useEffect, useCallback } from 'react'
import { 
  Filter, 
  Shuffle, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  Flag,
  CheckCircle,
  XCircle,
  BookOpen
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import QuestionCard from '../components/QuestionCard'
import ProgressBar from '../components/ProgressBar'
import { CompactTimer } from '../components/Timer'
import { useQuestionTimer } from '../hooks/useTimer'

/**
 * Practice Mode Page
 * Allows users to practice questions with various filters and options
 * Features: category filter, random mode, flagging, explanations
 */
function PracticeMode() {
  const { 
    questions, 
    categories, 
    isLoading, 
    practiceProgress,
    submitPracticeAnswer,
    toggleFlag,
    startPractice,
    currentPractice,
    navigatePractice,
    jumpToQuestion
  } = useApp()

  // Local state
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isRandom, setIsRandom] = useState(false)
  const [showTimer, setShowTimer] = useState(true)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)

  // Question timer
  const questionTimer = useQuestionTimer()

  // Get filtered questions
  const getFilteredQuestions = useCallback(() => {
    let filtered = questions
    if (selectedCategory !== 'all') {
      filtered = questions.filter(q => q.category === selectedCategory)
    }
    if (isRandom) {
      filtered = [...filtered].sort(() => Math.random() - 0.5)
    }
    return filtered
  }, [questions, selectedCategory, isRandom])

  // Start practice session
  const handleStartPractice = () => {
    const filtered = getFilteredQuestions()
    startPractice({ 
      category: selectedCategory, 
      random: isRandom,
      questionIds: filtered.map(q => q.id)
    })
    setSessionStarted(true)
    questionTimer.start()
  }

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    if (showFeedback) return
    
    setSelectedAnswer(answer)
    setShowFeedback(true)
    questionTimer.stop()
    
    const currentQuestion = currentPractice?.questions[currentPractice.currentIndex]
    if (currentQuestion) {
      submitPracticeAnswer(currentQuestion.id, answer)
    }
  }

  // Navigate to next question
  const handleNext = () => {
    if (currentPractice?.currentIndex < currentPractice.questions.length - 1) {
      navigatePractice('next')
      setSelectedAnswer(null)
      setShowFeedback(false)
      questionTimer.start()
    }
  }

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentPractice?.currentIndex > 0) {
      navigatePractice('prev')
      const prevQuestion = currentPractice.questions[currentPractice.currentIndex - 1]
      const prevAnswer = currentPractice.answers[prevQuestion.id]
      setSelectedAnswer(prevAnswer?.answer || null)
      setShowFeedback(!!prevAnswer)
    }
  }

  // Reset practice session
  const handleReset = () => {
    setSessionStarted(false)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setSelectedCategory('all')
    setIsRandom(false)
  }

  // Get current question
  const currentQuestion = currentPractice?.questions[currentPractice.currentIndex]
  const isFlagged = currentQuestion ? practiceProgress.flagged.includes(currentQuestion.id) : false

  // Calculate stats
  const answeredCount = Object.keys(currentPractice?.answers || {}).length
  const correctCount = Object.values(currentPractice?.answers || {}).filter(a => a.isCorrect).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-primary"></div>
      </div>
    )
  }

  // Settings view (before starting)
  if (!sessionStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Practice Mode</h1>
          <p className="text-cyber-muted">Customize your practice session</p>
        </div>

        <div className="bg-cyber-card rounded-xl p-6 border border-cyber-border space-y-6">
          {/* Category Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-white mb-3">
              <Filter className="w-4 h-4 text-cyber-primary" />
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-4 py-3 text-white focus:border-cyber-primary focus:outline-none"
            >
              <option value="all">All Categories ({questions.length} questions)</option>
              {categories.map(cat => {
                const count = questions.filter(q => q.category === cat).length
                return (
                  <option key={cat} value={cat}>
                    {cat} ({count} questions)
                  </option>
                )
              })}
            </select>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 bg-cyber-bg rounded-lg cursor-pointer hover:bg-cyber-border/30 transition-colors">
              <input
                type="checkbox"
                checked={isRandom}
                onChange={(e) => setIsRandom(e.target.checked)}
                className="w-5 h-5 rounded border-cyber-border bg-cyber-bg text-cyber-primary focus:ring-cyber-primary"
              />
              <div className="flex items-center gap-2">
                <Shuffle className="w-4 h-4 text-cyber-muted" />
                <span className="text-white">Randomize question order</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-cyber-bg rounded-lg cursor-pointer hover:bg-cyber-border/30 transition-colors">
              <input
                type="checkbox"
                checked={showTimer}
                onChange={(e) => setShowTimer(e.target.checked)}
                className="w-5 h-5 rounded border-cyber-border bg-cyber-bg text-cyber-primary focus:ring-cyber-primary"
              />
              <div className="flex items-center gap-2">
                <CompactTimer className="w-4 h-4 text-cyber-muted" />
                <span className="text-white">Show question timer</span>
              </div>
            </label>
          </div>

          {/* Question count */}
          <div className="p-4 bg-cyber-bg rounded-lg">
            <p className="text-cyber-muted text-sm">
              Session will include <span className="text-white font-bold">{getFilteredQuestions().length}</span> questions
            </p>
          </div>

          {/* Start button */}
          <button
            onClick={handleStartPractice}
            className="w-full py-4 bg-gradient-to-r from-cyber-primary to-cyan-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity btn-hover"
          >
            Start Practice Session
          </button>
        </div>

        {/* Previous progress */}
        {Object.keys(practiceProgress.answers).length > 0 && (
          <div className="bg-cyber-card rounded-xl p-6 border border-cyber-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Previous Progress</h3>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-cyber-bg rounded-lg">
                <p className="text-2xl font-bold text-white">
                  {Object.keys(practiceProgress.answers).length}
                </p>
                <p className="text-xs text-cyber-muted">Answered</p>
              </div>
              <div className="p-3 bg-cyber-bg rounded-lg">
                <p className="text-2xl font-bold text-emerald-400">
                  {Object.values(practiceProgress.answers).filter(a => a.isCorrect).length}
                </p>
                <p className="text-xs text-cyber-muted">Correct</p>
              </div>
              <div className="p-3 bg-cyber-bg rounded-lg">
                <p className="text-2xl font-bold text-amber-400">
                  {practiceProgress.flagged.length}
                </p>
                <p className="text-xs text-cyber-muted">Flagged</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Practice session view
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Practice Mode</h1>
          <p className="text-cyber-muted text-sm">
            Question {currentPractice.currentIndex + 1} of {currentPractice.questions.length}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {showTimer && (
            <CompactTimer 
              minutes={Math.floor(questionTimer.elapsedTime / 60)}
              seconds={questionTimer.elapsedTime % 60}
            />
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-cyber-border/50 text-cyber-muted rounded-lg hover:text-white hover:bg-cyber-border transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">End Session</span>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <ProgressBar
        current={currentPractice.currentIndex + 1}
        total={currentPractice.questions.length}
        showPercentage={false}
      />

      {/* Stats */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-cyber-card rounded-lg border border-cyber-border">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-cyber-muted">
            Correct: <span className="text-white font-medium">{correctCount}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-cyber-card rounded-lg border border-cyber-border">
          <XCircle className="w-4 h-4 text-red-400" />
          <span className="text-sm text-cyber-muted">
            Incorrect: <span className="text-white font-medium">{answeredCount - correctCount}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-cyber-card rounded-lg border border-cyber-border">
          <Flag className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-cyber-muted">
            Flagged: <span className="text-white font-medium">{practiceProgress.flagged.length}</span>
          </span>
        </div>
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentPractice.currentIndex + 1}
          totalQuestions={currentPractice.questions.length}
          selectedAnswer={selectedAnswer}
          showFeedback={showFeedback}
          isFlagged={isFlagged}
          onAnswerSelect={handleAnswerSelect}
          onFlagToggle={() => toggleFlag(currentQuestion.id)}
        />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentPractice.currentIndex === 0}
          className="flex items-center gap-2 px-6 py-3 bg-cyber-card text-white rounded-lg border border-cyber-border hover:border-cyber-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        {showFeedback && (
          <button
            onClick={handleNext}
            disabled={currentPractice.currentIndex === currentPractice.questions.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}

export default PracticeMode
