import { useState } from 'react'
import { Flag, BookOpen, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import OptionButton from './OptionButton'

/**
 * QuestionCard Component
 * Displays a single question with options and explanation
 * 
 * Props:
 * - question: Question object with id, text, options, correctAnswer, explanation
 * - selectedAnswer: Currently selected answer (A, B, C, D)
 * - showFeedback: Whether to show correct/incorrect feedback
 * - isFlagged: Whether question is flagged for review
 * - onAnswerSelect: Callback when answer is selected
 * - onFlagToggle: Callback when flag is toggled
 * - questionNumber: Current question number
 * - totalQuestions: Total number of questions
 * - className: Additional CSS classes
 */
function QuestionCard({
  question,
  selectedAnswer = null,
  showFeedback = false,
  isFlagged = false,
  onAnswerSelect,
  onFlagToggle,
  questionNumber = 1,
  totalQuestions = 100,
  className = ''
}) {
  const [showExplanation, setShowExplanation] = useState(false)
  
  if (!question) {
    return (
      <div className="bg-cyber-card rounded-xl p-8 text-center">
        <AlertCircle className="w-12 h-12 text-cyber-muted mx-auto mb-4" />
        <p className="text-cyber-muted">Question not found</p>
      </div>
    )
  }

  const { id, category, difficulty, question: questionText, options, correctAnswer, explanation } = question
  
  // Difficulty badge color
  const difficultyColors = {
    Easy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Hard: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  return (
    <div className={`bg-cyber-card rounded-xl border border-cyber-border overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-cyber-border bg-cyber-bg/50">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Question number and category */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-cyber-muted">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className="text-cyber-border">|</span>
            <span className="text-sm text-cyber-primary font-medium">
              {category}
            </span>
          </div>
          
          {/* Difficulty and Flag */}
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[difficulty]}`}>
              {difficulty}
            </span>
            
            {onFlagToggle && (
              <button
                onClick={onFlagToggle}
                className={`p-2 rounded-lg transition-colors ${
                  isFlagged 
                    ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' 
                    : 'text-cyber-muted hover:text-amber-400 hover:bg-amber-500/10'
                }`}
                title={isFlagged ? 'Remove flag' : 'Flag for review'}
              >
                <Flag className={`w-5 h-5 ${isFlagged ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Question text */}
      <div className="p-6">
        <h2 className="text-lg leading-relaxed text-white mb-6">
          {questionText}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {Object.entries(options).map(([key, text]) => (
            <OptionButton
              key={key}
              option={key}
              text={text}
              isSelected={selectedAnswer === key}
              isCorrect={correctAnswer === key}
              showFeedback={showFeedback}
              onClick={() => onAnswerSelect && onAnswerSelect(key)}
              disabled={showFeedback}
            />
          ))}
        </div>

        {/* Explanation section */}
        {showFeedback && explanation && (
          <div className="mt-6">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-2 text-cyber-primary hover:text-cyber-primary/80 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">
                {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
              </span>
              {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {showExplanation && (
              <div className="mt-4 p-4 bg-cyber-bg rounded-lg border border-cyber-border animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-cyber-primary/10 rounded-lg">
                    <BookOpen className="w-5 h-5 text-cyber-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Explanation</h4>
                    <p className="text-cyber-muted leading-relaxed">
                      {explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Compact Question Card for review/list view
 */
export function CompactQuestionCard({
  question,
  selectedAnswer,
  isCorrect,
  questionNumber,
  onClick,
}) {
  const statusColors = {
    correct: 'border-emerald-500/50 bg-emerald-500/10',
    incorrect: 'border-red-500/50 bg-red-500/10',
    unanswered: 'border-cyber-border bg-cyber-card',
  }

  const status = selectedAnswer ? (isCorrect ? 'correct' : 'incorrect') : 'unanswered'

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-cyber-primary/50 ${statusColors[status]}`}
    >
      <div className="flex items-start gap-4">
        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyber-border flex items-center justify-center text-sm font-medium text-cyber-muted">
          {questionNumber}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white line-clamp-2 mb-2">
            {question.question}
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-cyber-primary">{question.category}</span>
            <span className="text-cyber-border">|</span>
            <span className={`
              ${status === 'correct' ? 'text-emerald-400' :
                status === 'incorrect' ? 'text-red-400' :
                'text-cyber-muted'}
            `}>
              {selectedAnswer ? `Your answer: ${selectedAnswer}` : 'Not answered'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionCard
