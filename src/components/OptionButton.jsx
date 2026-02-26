import { Check, X, Flag } from 'lucide-react'

/**
 * OptionButton Component
 * Displays a single answer option with interactive states
 * 
 * Props:
 * - option: The option letter (A, B, C, D)
 * - text: The option text content
 * - isSelected: Whether this option is currently selected
 * - isCorrect: Whether this is the correct answer (for feedback)
 * - showFeedback: Whether to show correct/incorrect feedback
 * - isFlagged: Whether the question is flagged
 * - onClick: Click handler
 * - disabled: Whether the button is disabled
 * - className: Additional CSS classes
 */
function OptionButton({
  option,
  text,
  isSelected = false,
  isCorrect = false,
  showFeedback = false,
  onClick,
  disabled = false,
  className = ''
}) {
  // Determine button state and styling
  const getState = () => {
    if (!showFeedback) {
      return isSelected ? 'selected' : 'default'
    }
    
    if (isCorrect) return 'correct'
    if (isSelected && !isCorrect) return 'incorrect'
    return 'default'
  }
  
  const state = getState()
  
  // State styles
  const stateStyles = {
    default: `
      bg-cyber-card border-cyber-border text-cyber-text
      hover:border-cyber-primary hover:bg-cyber-primary/5
    `,
    selected: `
      bg-cyber-primary/20 border-cyber-primary text-cyber-primary
      ring-1 ring-cyber-primary/50
    `,
    correct: `
      bg-emerald-500/20 border-emerald-500 text-emerald-400
      ring-1 ring-emerald-500/50
    `,
    incorrect: `
      bg-red-500/20 border-red-500 text-red-400
      ring-1 ring-red-500/50
    `,
  }
  
  // State icons
  const StateIcon = () => {
    if (state === 'correct') {
      return <Check className="w-5 h-5 text-emerald-400" />
    }
    if (state === 'incorrect') {
      return <X className="w-5 h-5 text-red-400" />
    }
    return null
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || showFeedback}
      className={`
        w-full text-left p-4 rounded-xl border-2 transition-all duration-200
        flex items-start gap-4 group
        ${stateStyles[state]}
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {/* Option letter badge */}
      <div className={`
        flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
        font-bold text-lg transition-colors
        ${state === 'default' 
          ? 'bg-cyber-border text-cyber-muted group-hover:bg-cyber-primary/20 group-hover:text-cyber-primary' 
          : state === 'selected'
          ? 'bg-cyber-primary text-white'
          : state === 'correct'
          ? 'bg-emerald-500 text-white'
          : 'bg-red-500 text-white'
        }
      `}>
        {option}
      </div>
      
      {/* Option text */}
      <div className="flex-1 py-1">
        <p className={`text-base leading-relaxed ${
          state === 'default' ? 'text-cyber-text' :
          state === 'selected' ? 'text-cyber-primary' :
          state === 'correct' ? 'text-emerald-400' :
          'text-red-400'
        }`}>
          {text}
        </p>
      </div>
      
      {/* State icon */}
      <div className="flex-shrink-0 pt-1">
        <StateIcon />
      </div>
    </button>
  )
}

/**
 * Compact option for review mode
 */
export function CompactOption({
  option,
  isCorrect,
  isSelected,
  showFeedback,
}) {
  let bgClass = 'bg-cyber-border text-cyber-muted'
  
  if (showFeedback) {
    if (isCorrect) {
      bgClass = 'bg-emerald-500 text-white'
    } else if (isSelected) {
      bgClass = 'bg-red-500 text-white'
    }
  } else if (isSelected) {
    bgClass = 'bg-cyber-primary text-white'
  }

  return (
    <div className={`
      w-8 h-8 rounded-lg flex items-center justify-center
      font-bold text-sm ${bgClass}
    `}>
      {option}
    </div>
  )
}

/**
 * Option legend for review page
 */
export function OptionLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500" />
        <span className="text-cyber-muted">Correct Answer</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500" />
        <span className="text-cyber-muted">Your Answer (Wrong)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-cyber-primary/20 border border-cyber-primary" />
        <span className="text-cyber-muted">Selected</span>
      </div>
    </div>
  )
}

export default OptionButton
