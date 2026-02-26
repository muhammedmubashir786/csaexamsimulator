import { useEffect, useState } from 'react'
import { Clock, AlertCircle, AlertTriangle } from 'lucide-react'

/**
 * Timer Component
 * Displays countdown timer with visual warnings
 * 
 * Props:
 * - minutes: Current minutes remaining
 * - seconds: Current seconds remaining
 * - totalMinutes: Total exam time (for progress calculation)
 * - isRunning: Whether timer is active
 * - onStart: Callback to start timer
 * - onPause: Callback to pause timer
 * - size: 'sm' | 'md' | 'lg'
 * - showIcon: Whether to show clock icon
 * - className: Additional CSS classes
 */
function Timer({ 
  minutes = 0, 
  seconds = 0, 
  totalMinutes = 60,
  isRunning = false,
  onStart,
  onPause,
  size = 'md',
  showIcon = true,
  className = ''
}) {
  // Calculate progress percentage
  const totalSeconds = totalMinutes * 60
  const currentSeconds = minutes * 60 + seconds
  const progress = (currentSeconds / totalSeconds) * 100
  
  // Determine status based on remaining time
  const getStatus = () => {
    if (progress <= 10) return 'danger'
    if (progress <= 25) return 'warning'
    return 'normal'
  }
  
  const status = getStatus()
  
  // Size classes
  const sizeClasses = {
    sm: {
      container: 'px-3 py-1.5 text-sm gap-1.5',
      icon: 'w-4 h-4',
      time: 'font-mono text-base',
    },
    md: {
      container: 'px-4 py-2 text-base gap-2',
      icon: 'w-5 h-5',
      time: 'font-mono text-lg',
    },
    lg: {
      container: 'px-6 py-3 text-lg gap-3',
      icon: 'w-6 h-6',
      time: 'font-mono text-2xl',
    },
  }
  
  // Status styles
  const statusStyles = {
    normal: 'bg-cyber-primary/10 text-cyber-primary border-cyber-primary/30',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/30 animate-pulse',
    danger: 'bg-red-500/10 text-red-500 border-red-500/30 animate-pulse',
  }
  
  // Get status icon
  const StatusIcon = () => {
    if (status === 'danger') return <AlertTriangle className={sizeClasses[size].icon} />
    if (status === 'warning') return <AlertCircle className={sizeClasses[size].icon} />
    return <Clock className={sizeClasses[size].icon} />
  }
  
  // Format time display
  const formatTime = () => {
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    const secs = seconds
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div 
      className={`
        inline-flex items-center rounded-lg border
        ${sizeClasses[size].container}
        ${statusStyles[status]}
        ${className}
      `}
    >
      {showIcon && <StatusIcon />}
      
      <span className={`${sizeClasses[size].time} font-bold tracking-wider`}>
        {formatTime()}
      </span>
      
      {/* Progress bar */}
      <div className="hidden sm:block w-16 lg:w-24 h-1.5 bg-black/20 rounded-full overflow-hidden ml-2">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${
            status === 'danger' ? 'bg-red-500' :
            status === 'warning' ? 'bg-amber-500' :
            'bg-cyber-primary'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Control buttons (optional) */}
      {onStart && onPause && (
        <button
          onClick={isRunning ? onPause : onStart}
          className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
      )}
    </div>
  )
}

/**
 * Compact Timer Display
 * Minimal timer for small spaces
 */
export function CompactTimer({ minutes = 0, seconds = 0, className = '' }) {
  const totalSeconds = minutes * 60 + seconds
  const isLow = totalSeconds < 300 // Less than 5 minutes
  const isCritical = totalSeconds < 60 // Less than 1 minute
  
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <Clock className={`w-4 h-4 ${
        isCritical ? 'text-red-500 animate-pulse' :
        isLow ? 'text-amber-500' :
        'text-cyber-muted'
      }`} />
      <span className={`font-mono text-sm font-medium ${
        isCritical ? 'text-red-500' :
        isLow ? 'text-amber-500' :
        'text-cyber-text'
      }`}>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  )
}

/**
 * Timer Ring Component
 * Circular progress indicator for timer
 */
export function TimerRing({ 
  minutes = 0, 
  seconds = 0, 
  totalMinutes = 60,
  size = 80 
}) {
  const totalSeconds = totalMinutes * 60
  const currentSeconds = minutes * 60 + seconds
  const percentage = (currentSeconds / totalSeconds) * 100
  
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference
  
  // Color based on remaining time
  const getColor = () => {
    if (percentage <= 10) return '#ef4444'
    if (percentage <= 25) return '#f59e0b'
    return '#06b6d4'
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold font-mono text-white">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

export default Timer
