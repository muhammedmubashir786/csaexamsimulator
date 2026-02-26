import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for persisting state to localStorage
 * Automatically syncs state with localStorage and handles JSON serialization
 * 
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Default value if no stored value exists
 * @returns {[any, Function]} - [storedValue, setValue]
 * 
 * Usage:
 * const [name, setName] = useLocalStorage('username', 'Guest')
 */
export function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use provided initialValue
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Update localStorage when state changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  // Memoized setter that also updates localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  // Function to remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

/**
 * Hook for managing exam history in localStorage
 */
export function useExamHistory() {
  const [history, setHistory] = useLocalStorage('csa_exam_history', [])

  const addExamResult = useCallback((result) => {
    const newResult = {
      ...result,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    }
    setHistory(prev => [newResult, ...prev].slice(0, 50)) // Keep last 50 exams
  }, [setHistory])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [setHistory])

  const getBestScore = useCallback(() => {
    if (history.length === 0) return 0
    return Math.max(...history.map(h => h.score))
  }, [history])

  const getAverageScore = useCallback(() => {
    if (history.length === 0) return 0
    return Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length)
  }, [history])

  return {
    history,
    addExamResult,
    clearHistory,
    getBestScore,
    getAverageScore,
  }
}

/**
 * Hook for managing practice progress
 */
export function usePracticeProgress() {
  const [progress, setProgress] = useLocalStorage('csa_practice_progress', {
    currentQuestion: 0,
    answers: {},
    flagged: [],
    categoryStats: {},
  })

  const updateAnswer = useCallback((questionId, answer, isCorrect) => {
    setProgress(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: { answer, isCorrect, timestamp: Date.now() }
      }
    }))
  }, [setProgress])

  const toggleFlag = useCallback((questionId) => {
    setProgress(prev => {
      const flagged = prev.flagged.includes(questionId)
        ? prev.flagged.filter(id => id !== questionId)
        : [...prev.flagged, questionId]
      return { ...prev, flagged }
    })
  }, [setProgress])

  const resetProgress = useCallback(() => {
    setProgress({
      currentQuestion: 0,
      answers: {},
      flagged: [],
      categoryStats: {},
    })
  }, [setProgress])

  return {
    progress,
    updateAnswer,
    toggleFlag,
    resetProgress,
    setProgress,
  }
}
