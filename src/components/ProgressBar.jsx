/**
 * ProgressBar Component
 * Shows visual progress with percentage and customizable styling
 * 
 * Props:
 * - current: Current progress value
 * - total: Total/maximum value
 * - showPercentage: Whether to show percentage text
 * - size: 'sm' | 'md' | 'lg'
 * - color: Custom color class
 * - animated: Whether to animate progress changes
 */
function ProgressBar({ 
  current = 0, 
  total = 100, 
  showPercentage = true,
  size = 'md',
  color = 'bg-cyber-primary',
  animated = true,
  className = ''
}) {
  // Calculate percentage
  const percentage = Math.min(100, Math.max(0, (current / total) * 100))
  
  // Size classes
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }
  
  // Determine color based on percentage
  const getColorClass = () => {
    if (color !== 'bg-cyber-primary') return color
    if (percentage >= 80) return 'bg-emerald-500'
    if (percentage >= 60) return 'bg-cyber-primary'
    if (percentage >= 40) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Progress track */}
      <div className={`w-full bg-cyber-border rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${getColorClass()} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ 
            width: `${percentage}%`,
            transitionTimingFunction: animated ? 'cubic-bezier(0.4, 0, 0.2, 1)' : 'linear'
          }}
        />
      </div>
      
      {/* Percentage text */}
      {showPercentage && (
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-cyber-muted">
            {current} of {total}
          </span>
          <span className="text-xs font-medium text-cyber-text">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Circular Progress Bar Component
 * Shows progress in a circular format
 */
export function CircularProgress({ 
  percentage = 0, 
  size = 120, 
  strokeWidth = 8,
  color = '#06b6d4'
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#334155"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-white">{Math.round(percentage)}%</span>
      </div>
    </div>
  )
}

/**
 * Step Progress Component
 * Shows progress through discrete steps
 */
export function StepProgress({ 
  steps = [], 
  currentStep = 0,
  onStepClick = null
}) {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isClickable = onStepClick && (isCompleted || isCurrent)
        
        return (
          <div key={index} className="flex items-center flex-1 last:flex-none">
            {/* Step circle */}
            <button
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                isCompleted
                  ? 'bg-emerald-500 text-white'
                  : isCurrent
                  ? 'bg-cyber-primary text-white ring-2 ring-cyber-primary/50'
                  : 'bg-cyber-border text-cyber-muted'
              } ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
            >
              {isCompleted ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </button>
            
            {/* Step label */}
            {step.label && (
              <span className={`ml-2 text-sm hidden sm:block ${
                isCurrent ? 'text-white font-medium' : 'text-cyber-muted'
              }`}>
                {step.label}
              </span>
            )}
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                isCompleted ? 'bg-emerald-500' : 'bg-cyber-border'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ProgressBar
