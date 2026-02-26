import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useLocalStorage, useExamHistory, usePracticeProgress } from '../hooks/useLocalStorage'

// Create the context
const AppContext = createContext(null)

/**
 * AppProvider - Global state management for the CSA Exam Simulator
 * 
 * Provides:
 * - Questions data management
 * - Exam state and history
 * - Practice progress tracking
 * - User preferences
 * - Loading states
 */
export function AppProvider({ children }) {
  // Questions data
  const [questions, setQuestions] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // User preferences
  const [preferences, setPreferences] = useLocalStorage('csa_preferences', {
    darkMode: true,
    showTimer: true,
    autoAdvance: false,
    soundEnabled: false,
  })

  // Exam and practice tracking
  const examHistory = useExamHistory()
  const practiceProgress = usePracticeProgress()

  // Current session state
  const [currentExam, setCurrentExam] = useState(null)
  const [currentPractice, setCurrentPractice] = useState(null)

  // Load questions from JSON file
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/data/questions.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setQuestions(data.questions || [])
        setCategories(data.categories || [])
        setError(null)
      } catch (err) {
        console.error('Failed to load questions:', err)
        setError('Failed to load questions. Please refresh the page.')
      } finally {
        setIsLoading(false)
      }
    }

    loadQuestions()
  }, [])

  // Get questions by category
  const getQuestionsByCategory = useCallback((category) => {
    if (!category || category === 'all') return questions
    return questions.filter(q => q.category === category)
  }, [questions])

  // Get random questions for exam
  const getRandomQuestions = useCallback((count = 50) => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(count, shuffled.length))
  }, [questions])

  // Get question by ID
  const getQuestionById = useCallback((id) => {
    return questions.find(q => q.id === parseInt(id))
  }, [questions])

  // Start a new exam
  const startExam = useCallback(() => {
    const examQuestions = getRandomQuestions(50)
    const exam = {
      id: Date.now().toString(),
      questions: examQuestions,
      answers: {},
      startTime: Date.now(),
      status: 'in_progress',
    }
    setCurrentExam(exam)
    return exam
  }, [getRandomQuestions])

  // Submit exam answer
  const submitExamAnswer = useCallback((questionId, answer) => {
    setCurrentExam(prev => {
      if (!prev) return null
      const question = prev.questions.find(q => q.id === questionId)
      const isCorrect = question?.correctAnswer === answer
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: { answer, isCorrect, timestamp: Date.now() }
        }
      }
    })
  }, [])

  // Finish exam
  const finishExam = useCallback(() => {
    setCurrentExam(prev => {
      if (!prev) return null
      
      const totalQuestions = prev.questions.length
      const correctCount = Object.values(prev.answers).filter(a => a.isCorrect).length
      const score = Math.round((correctCount / totalQuestions) * 100)
      
      const result = {
        ...prev,
        endTime: Date.now(),
        status: 'completed',
        score,
        correctCount,
        totalQuestions,
      }
      
      // Save to history
      examHistory.addExamResult(result)
      
      return result
    })
  }, [examHistory])

  // Start practice session
  const startPractice = useCallback((options = {}) => {
    const { category, difficulty, random, questionIds } = options
    
    let practiceQuestions = questions
    
    if (questionIds && questionIds.length > 0) {
      practiceQuestions = questions.filter(q => questionIds.includes(q.id))
    } else if (category && category !== 'all') {
      practiceQuestions = questions.filter(q => q.category === category)
    }
    
    if (difficulty && difficulty !== 'all') {
      practiceQuestions = practiceQuestions.filter(q => q.difficulty === difficulty)
    }
    
    if (random) {
      practiceQuestions = [...practiceQuestions].sort(() => Math.random() - 0.5)
    }
    
    const practice = {
      id: Date.now().toString(),
      questions: practiceQuestions,
      currentIndex: 0,
      answers: {},
      startTime: Date.now(),
      options,
    }
    
    setCurrentPractice(practice)
    return practice
  }, [questions])

  // Submit practice answer
  const submitPracticeAnswer = useCallback((questionId, answer) => {
    const question = questions.find(q => q.id === questionId)
    const isCorrect = question?.correctAnswer === answer
    
    practiceProgress.updateAnswer(questionId, answer, isCorrect)
    
    setCurrentPractice(prev => {
      if (!prev) return null
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: { answer, isCorrect, timestamp: Date.now() }
        }
      }
    })
    
    return isCorrect
  }, [questions, practiceProgress])

  // Navigate to next/previous question in practice
  const navigatePractice = useCallback((direction) => {
    setCurrentPractice(prev => {
      if (!prev) return null
      const newIndex = direction === 'next' 
        ? Math.min(prev.currentIndex + 1, prev.questions.length - 1)
        : Math.max(prev.currentIndex - 1, 0)
      return { ...prev, currentIndex: newIndex }
    })
  }, [])

  // Jump to specific question in practice
  const jumpToQuestion = useCallback((index) => {
    setCurrentPractice(prev => {
      if (!prev) return null
      if (index < 0 || index >= prev.questions.length) return prev
      return { ...prev, currentIndex: index }
    })
  }, [])

  // Update preferences
  const updatePreferences = useCallback((updates) => {
    setPreferences(prev => ({ ...prev, ...updates }))
  }, [setPreferences])

  // Reset all data
  const resetAllData = useCallback(() => {
    examHistory.clearHistory()
    practiceProgress.resetProgress()
    setCurrentExam(null)
    setCurrentPractice(null)
  }, [examHistory, practiceProgress])

  // Computed values
  const stats = useMemo(() => ({
    totalQuestions: questions.length,
    totalCategories: categories.length,
    examsTaken: examHistory.history.length,
    averageScore: examHistory.getAverageScore(),
    bestScore: examHistory.getBestScore(),
  }), [questions.length, categories.length, examHistory])

  const value = {
    // Data
    questions,
    categories,
    isLoading,
    error,
    
    // State
    preferences,
    currentExam,
    currentPractice,
    
    // History & Progress
    examHistory: examHistory.history,
    practiceProgress: practiceProgress.progress,
    
    // Stats
    stats,
    
    // Actions
    getQuestionsByCategory,
    getRandomQuestions,
    getQuestionById,
    
    // Exam actions
    startExam,
    submitExamAnswer,
    finishExam,
    
    // Practice actions
    startPractice,
    submitPracticeAnswer,
    navigatePractice,
    jumpToQuestion,
    toggleFlag: practiceProgress.toggleFlag,
    
    // Preferences
    updatePreferences,
    
    // Reset
    resetAllData,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

/**
 * Custom hook to use the AppContext
 * Must be used within AppProvider
 */
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
