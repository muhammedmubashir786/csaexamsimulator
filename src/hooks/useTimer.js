import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Custom hook for countdown timer functionality
 * Used for exam mode timing
 * 
 * @param {number} initialMinutes - Starting time in minutes
 * @param {Function} onExpire - Callback when timer reaches zero
 * @returns {Object} - Timer state and controls
 * 
 * Usage:
 * const { minutes, seconds, isRunning, start, pause, reset } = useTimer(60, handleTimeUp)
 */
export function useTimer(initialMinutes = 60, onExpire = () => {}) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef(null)
  const onExpireRef = useRef(onExpire)

  // Keep callback reference current
  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  // Timer countdown effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer expired
            setIsRunning(false)
            onExpireRef.current()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback((newMinutes = initialMinutes) => {
    setIsRunning(false)
    setTimeLeft(newMinutes * 60)
  }, [initialMinutes])

  const addTime = useCallback((minutes) => {
    setTimeLeft(prev => prev + minutes * 60)
  }, [])

  // Format time for display
  const formatTime = useCallback(() => {
    const hours = Math.floor(timeLeft / 3600)
    const minutes = Math.floor((timeLeft % 3600) / 60)
    const seconds = timeLeft % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, [timeLeft])

  // Get percentage of time remaining
  const getProgress = useCallback(() => {
    return (timeLeft / (initialMinutes * 60)) * 100
  }, [timeLeft, initialMinutes])

  // Determine timer status for styling
  const getStatus = useCallback(() => {
    const totalSeconds = initialMinutes * 60
    const percentage = (timeLeft / totalSeconds) * 100
    
    if (percentage <= 10) return 'danger'
    if (percentage <= 25) return 'warning'
    return 'normal'
  }, [timeLeft, initialMinutes])

  return {
    timeLeft,
    minutes: Math.floor(timeLeft / 60),
    seconds: timeLeft % 60,
    isRunning,
    formattedTime: formatTime(),
    progress: getProgress(),
    status: getStatus(),
    start,
    pause,
    reset,
    addTime,
  }
}

/**
 * Hook for tracking time spent on individual questions
 */
export function useQuestionTimer() {
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  const start = useCallback(() => {
    setStartTime(Date.now())
    setElapsedTime(0)
  }, [])

  const stop = useCallback(() => {
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      setElapsedTime(elapsed)
      setStartTime(null)
      return elapsed
    }
    return 0
  }, [startTime])

  const reset = useCallback(() => {
    setStartTime(null)
    setElapsedTime(0)
  }, [])

  return {
    elapsedTime,
    start,
    stop,
    reset,
    isRunning: startTime !== null,
  }
}

/**
 * Hook for tracking total study time
 */
export function useStudyTimeTracker() {
  const [totalStudyTime, setTotalStudyTime] = useLocalStorage('csa_study_time', 0)
  const [sessionStart, setSessionStart] = useState(null)

  const startSession = useCallback(() => {
    setSessionStart(Date.now())
  }, [])

  const endSession = useCallback(() => {
    if (sessionStart) {
      const sessionDuration = Math.floor((Date.now() - sessionStart) / 1000)
      setTotalStudyTime(prev => prev + sessionDuration)
      setSessionStart(null)
      return sessionDuration
    }
    return 0
  }, [sessionStart, setTotalStudyTime])

  const formatStudyTime = useCallback((seconds = totalStudyTime) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }, [totalStudyTime])

  return {
    totalStudyTime,
    startSession,
    endSession,
    formatStudyTime,
    isTracking: sessionStart !== null,
  }
}

// Import useLocalStorage for useStudyTimeTracker
import { useLocalStorage } from './useLocalStorage'
