import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Flag,
  Clock,
  CheckCircle,
  X
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import QuestionCard from '../components/QuestionCard'
import Timer from '../components/Timer'
import ProgressBar from '../components/ProgressBar'
import { useTimer } from '../hooks/useTimer'
import { EXAM_CONFIG } from '../utils/constants'

/**
 * Exam Mode Page
 * Simulates a real exam with timer and 50 random questions
 */
function ExamMode() {
  const navigate = useNavigate()
  const { 
    startExam, 
    currentExam, 
    submitExamAnswer, 
    finishExam,
    isLoading 
  } = useApp()

  // Local state
  const [examStarted, setExamStarted] = useState(false)
  const [showConfirmEnd, setShowConfirmEnd] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Timer hook
  const timer = useTimer(EXAM_CONFIG.EXAM_DURATION_MINUTES, handleTimeUp)

  // Handle timer expiration
  function handleTimeUp() {
    handleFinishExam()
  }

  // Start exam
  const handleStartExam = () => {
    startExam()
    setExamStarted(true)
    setCurrentIndex(0)
    timer.start()
  }

  // Handle answer selection
  const handleAnswerSelect = useCallback((answer) => {
    if (showFeedback || !currentExam) return
    
    setSelectedAnswer(answer)
    setShowFeedback(true)
    
    const currentQuestion = currentExam.questions[currentIndex]
    submitExamAnswer(currentQuestion.id, answer)
  }, [currentExam, currentIndex, submitExamAnswer, showFeedback])

  // Navigate to next question
  const handleNext = () => {
    if (currentExam && currentIndex < currentExam.questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    }
  }

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      const prevQuestion = currentExam.questions[currentIndex - 1]
      const prevAnswer = currentExam.answers[prevQuestion.id]
      setSelectedAnswer(prevAnswer?.answer || null)
      setShowFeedback(!!prevAnswer)
    }
  }

  // Finish exam
  const handleFinishExam = () => {
    timer.pause()
    finishExam()
    navigate('/review')
  }

  // Get current question
  const currentQuestion = currentExam?.questions[currentIndex]
  
  // Get answer for current question
  const currentAnswer = currentQuestion ? currentExam?.answers[currentQuestion.id] : null

  // Calculate progress
  const answeredCount = Object.keys(currentExam?.answers || {}).length
  const progress = currentExam ? (answeredCount / currentExam.questions.length) * 100 : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-primary"></div>
      </div>
    )
  }

  // Pre-exam view
  if (!examStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Exam Mode</h1>
          <p className="text-cyber-muted">Simulate the real CSA exam experience</p>
        </div>

        <div className="bg-cyber-card rounded-xl p-6 border border-cyber-border space-y-6">
          {/* Exam info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-cyber-bg rounded-lg">
              <p className="text-3xl font-bold text-cyber-primary">
                {EXAM_CONFIG.EXAM_QUESTION_COUNT}
              </p>
              <p className="text-xs text-cyber-muted mt-1">Questions</p>
            </div>
            <div className="text-center p-4 bg-cyber-bg rounded-lg">
              <p className="text-3xl font-bold text-cyber-primary">
                {EXAM_CONFIG.EXAM_DURATION_MINUTES}
              </p>
              <p className="text-xs text-cyber-muted mt-1">Minutes</p>
            </div>
            <div className="text-center p-4 bg-cyber-bg rounded-lg">
              <p className="text-3xl font-bold text-cyber-primary">
                {EXAM_CONFIG.PASSING_SCORE_PERCENT}%
              </p>
              <p className="text-xs text-cyber-muted mt-1">Passing Score</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <h3 className="font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Important Instructions
            </h3>
            <ul className="space-y-2 text-cyber-muted text-sm">
              <li className="flex items-start gap-2">
                <span className="text-cyber-primary mt-0.5">•</span>
                You will have {EXAM_CONFIG.EXAM_DURATION_MINUTES} minutes to complete {EXAM_CONFIG.EXAM_QUESTION_COUNT} randomly selected questions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-primary mt-0.5">•</span>
                The timer cannot be paused once started
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-primary mt-0.5">•</span>
                You can navigate between questions using Previous/Next buttons
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-primary mt-0.5">•</span>
                Flag questions to review them later
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-primary mt-0.5">•</span>
                Click "Finish Exam" to submit and view your results
              </li>
            </ul>
          </div>

          {/* Start button */}
          <button
            onClick={handleStartExam}
            className="w-full py-4 bg-gradient-to-r from-cyber-secondary to-violet-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity btn-hover"
          >
            Start Exam
          </button>
        </div>
      </div>
    )
  }

  // Exam in progress
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header with timer and progress */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">CSA Exam</h1>
          <p className="text-cyber-muted text-sm">
            Question {currentIndex + 1} of {currentExam.questions.length}
          </p>
        </div>
        
        <Timer
          minutes={timer.minutes}
          seconds={timer.seconds}
          totalMinutes={EXAM_CONFIG.EXAM_DURATION_MINUTES}
          isRunning={timer.isRunning}
          size="md"
        />
      </div>

      {/* Progress bar */}
      <ProgressBar
        current={answeredCount}
        total={currentExam.questions.length}
        showPercentage={true}
      />

      {/* Question grid for quick navigation */}
      <div className="bg-cyber-card rounded-lg p-3 border border-cyber-border">
        <div className="flex flex-wrap gap-2">
          {currentExam.questions.map((q, idx) => {
            const isAnswered = currentExam.answers[q.id]
            const isCurrent = idx === currentIndex
            
            return (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentIndex(idx)
                  const answer = currentExam.answers[q.id]
                  setSelectedAnswer(answer?.answer || null)
                  setShowFeedback(!!answer)
                }}
                className={`
                  w-8 h-8 rounded-lg text-sm font-medium transition-all
                  ${isCurrent 
                    ? 'bg-cyber-primary text-white ring-2 ring-cyber-primary/50' 
                    : isAnswered
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-cyber-bg text-cyber-muted hover:bg-cyber-border'
                  }
                `}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={currentExam.questions.length}
          selectedAnswer={selectedAnswer || currentAnswer?.answer}
          showFeedback={showFeedback || !!currentAnswer}
          onAnswerSelect={handleAnswerSelect}
        />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-6 py-3 bg-cyber-card text-white rounded-lg border border-cyber-border hover:border-cyber-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        {/* Finish button */}
        <button
          onClick={() => setShowConfirmEnd(true)}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Finish Exam
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === currentExam.questions.length - 1}
          className="flex items-center gap-2 px-6 py-3 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmEnd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-cyber-card rounded-xl p-6 max-w-md w-full border border-cyber-border animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Finish Exam?</h3>
            </div>
            
            <p className="text-cyber-muted mb-6">
              You have answered <span className="text-white font-bold">{answeredCount}</span> out of{' '}
              <span className="text-white font-bold">{currentExam.questions.length}</span> questions.
              {answeredCount < currentExam.questions.length && (
                <span className="block mt-2 text-amber-400">
                  Warning: You have {currentExam.questions.length - answeredCount} unanswered questions.
                </span>
              )}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmEnd(false)}
                className="flex-1 py-3 bg-cyber-border text-white rounded-lg hover:bg-cyber-border/80 transition-colors"
              >
                Continue Exam
              </button>
              <button
                onClick={handleFinishExam}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExamMode
