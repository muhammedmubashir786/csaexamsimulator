import { useMemo, useCallback } from 'react'

/**
 * Custom hook for calculating analytics and statistics
 * Processes exam history and practice data to generate insights
 * 
 * @param {Array} examHistory - Array of past exam results
 * @param {Object} practiceProgress - Current practice progress data
 * @returns {Object} - Calculated analytics
 */
export function useAnalytics(examHistory = [], practiceProgress = {}) {
  // Calculate overall statistics
  const overallStats = useMemo(() => {
    if (examHistory.length === 0) {
      return {
        totalExams: 0,
        averageScore: 0,
        bestScore: 0,
        worstScore: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        accuracy: 0,
      }
    }

    const scores = examHistory.map(exam => exam.score)
    const totalQuestions = examHistory.reduce((sum, exam) => sum + (exam.totalQuestions || 50), 0)
    const correctAnswers = examHistory.reduce((sum, exam) => sum + (exam.correctCount || 0), 0)

    return {
      totalExams: examHistory.length,
      averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      bestScore: Math.max(...scores),
      worstScore: Math.min(...scores),
      totalQuestions,
      correctAnswers,
      accuracy: Math.round((correctAnswers / totalQuestions) * 100),
    }
  }, [examHistory])

  // Calculate category-wise performance
  const categoryStats = useMemo(() => {
    const stats = {}
    
    // Process practice answers
    if (practiceProgress.answers) {
      Object.entries(practiceProgress.answers).forEach(([questionId, answerData]) => {
        // In real implementation, we'd look up the question category
        // For now, we'll aggregate by correctness
        const key = answerData.isCorrect ? 'correct' : 'incorrect'
        if (!stats[key]) {
          stats[key] = { correct: 0, incorrect: 0, total: 0 }
        }
        stats[key][answerData.isCorrect ? 'correct' : 'incorrect']++
        stats[key].total++
      })
    }

    // Process exam history for category data
    examHistory.forEach(exam => {
      if (exam.categoryBreakdown) {
        Object.entries(exam.categoryBreakdown).forEach(([category, data]) => {
          if (!stats[category]) {
            stats[category] = { correct: 0, incorrect: 0, total: 0 }
          }
          stats[category].correct += data.correct || 0
          stats[category].incorrect += data.incorrect || 0
          stats[category].total += data.total || 0
        })
      }
    })

    // Calculate percentages
    Object.keys(stats).forEach(key => {
      const stat = stats[key]
      stat.accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0
    })

    return stats
  }, [examHistory, practiceProgress.answers])

  // Identify weak areas (categories with < 70% accuracy)
  const weakAreas = useMemo(() => {
    return Object.entries(categoryStats)
      .filter(([_, stats]) => stats.accuracy < 70 && stats.total >= 5)
      .sort((a, b) => a[1].accuracy - b[1].accuracy)
      .map(([category, stats]) => ({
        category,
        accuracy: stats.accuracy,
        total: stats.total,
        correct: stats.correct,
      }))
  }, [categoryStats])

  // Identify strong areas (categories with >= 80% accuracy)
  const strongAreas = useMemo(() => {
    return Object.entries(categoryStats)
      .filter(([_, stats]) => stats.accuracy >= 80 && stats.total >= 5)
      .sort((a, b) => b[1].accuracy - a[1].accuracy)
      .map(([category, stats]) => ({
        category,
        accuracy: stats.accuracy,
        total: stats.total,
        correct: stats.correct,
      }))
  }, [categoryStats])

  // Calculate progress over time
  const progressOverTime = useMemo(() => {
    if (examHistory.length < 2) return []
    
    return examHistory
      .slice()
      .reverse()
      .map((exam, index) => ({
        attempt: index + 1,
        date: new Date(exam.date).toLocaleDateString(),
        score: exam.score,
        correct: exam.correctCount,
        total: exam.totalQuestions,
      }))
  }, [examHistory])

  // Calculate recommended focus areas
  const recommendations = useMemo(() => {
    const recs = []
    
    if (weakAreas.length > 0) {
      recs.push({
        type: 'weak_area',
        priority: 'high',
        message: `Focus on ${weakAreas[0].category} - ${weakAreas[0].accuracy}% accuracy`,
        action: 'Practice more questions in this category',
      })
    }

    if (overallStats.accuracy < 70) {
      recs.push({
        type: 'overall',
        priority: 'high',
        message: 'Overall accuracy below 70%',
        action: 'Review fundamentals and take more practice tests',
      })
    }

    if (examHistory.length < 3) {
      recs.push({
        type: 'practice',
        priority: 'medium',
        message: 'Limited exam history',
        action: 'Take more exams to establish performance baseline',
      })
    }

    return recs
  }, [weakAreas, overallStats, examHistory.length])

  // Get performance level
  const performanceLevel = useCallback((score) => {
    if (score >= 90) return { level: 'Excellent', color: '#10b981' }
    if (score >= 75) return { level: 'Good', color: '#06b6d4' }
    if (score >= 60) return { level: 'Average', color: '#f59e0b' }
    return { level: 'Needs Improvement', color: '#ef4444' }
  }, [])

  // Calculate streaks
  const streaks = useMemo(() => {
    if (examHistory.length === 0) return { current: 0, best: 0 }
    
    let currentStreak = 0
    let bestStreak = 0
    let tempStreak = 0

    // Sort by date descending
    const sorted = [...examHistory].sort((a, b) => new Date(b.date) - new Date(a.date))
    
    // Calculate current streak (passing scores in a row)
    for (const exam of sorted) {
      if (exam.score >= 70) {
        currentStreak++
      } else {
        break
      }
    }

    // Calculate best streak
    for (const exam of examHistory) {
      if (exam.score >= 70) {
        tempStreak++
        bestStreak = Math.max(bestStreak, tempStreak)
      } else {
        tempStreak = 0
      }
    }

    return { current: currentStreak, best: bestStreak }
  }, [examHistory])

  return {
    overallStats,
    categoryStats,
    weakAreas,
    strongAreas,
    progressOverTime,
    recommendations,
    performanceLevel,
    streaks,
  }
}

/**
 * Hook for tracking question-specific analytics
 */
export function useQuestionAnalytics(questions = [], answers = {}) {
  // Calculate difficulty based on answer patterns
  const questionDifficulty = useMemo(() => {
    const difficultyMap = {}
    
    Object.entries(answers).forEach(([questionId, answerData]) => {
      if (!difficultyMap[questionId]) {
        difficultyMap[questionId] = { attempts: 0, correct: 0 }
      }
      difficultyMap[questionId].attempts++
      if (answerData.isCorrect) {
        difficultyMap[questionId].correct++
      }
    })

    // Calculate difficulty percentage
    Object.keys(difficultyMap).forEach(id => {
      const stat = difficultyMap[id]
      stat.accuracy = stat.attempts > 0 ? (stat.correct / stat.attempts) * 100 : 0
      // Lower accuracy = higher difficulty
      if (stat.accuracy >= 80) stat.difficulty = 'Easy'
      else if (stat.accuracy >= 50) stat.difficulty = 'Medium'
      else stat.difficulty = 'Hard'
    })

    return difficultyMap
  }, [answers])

  // Get frequently missed questions
  const frequentlyMissed = useMemo(() => {
    return Object.entries(questionDifficulty)
      .filter(([_, data]) => data.accuracy < 50 && data.attempts >= 2)
      .sort((a, b) => a[1].accuracy - b[1].accuracy)
      .slice(0, 10)
  }, [questionDifficulty])

  return {
    questionDifficulty,
    frequentlyMissed,
  }
}
