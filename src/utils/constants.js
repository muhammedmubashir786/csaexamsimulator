/**
 * Constants used throughout the application
 */

// Exam configuration
export const EXAM_CONFIG = {
  TOTAL_QUESTIONS: 100,
  EXAM_QUESTION_COUNT: 50,
  EXAM_DURATION_MINUTES: 60,
  PASSING_SCORE_PERCENT: 70,
}

// Category colors for charts and UI
export const CATEGORY_COLORS = {
  'Web Application Security': '#06b6d4',
  'Threat Intelligence': '#8b5cf6',
  'Network Security': '#10b981',
  'SIEM': '#f59e0b',
  'Incident Response': '#ef4444',
  'Risk Assessment': '#ec4899',
  'Cloud Security': '#3b82f6',
  'Logging & Monitoring': '#14b8a6',
  'Digital Forensics': '#f97316',
  'Database Security': '#6366f1',
  'SOC Operations': '#84cc16',
  'SOAR': '#a855f7',
  'SOC Maturity': '#22c55e',
  'Vulnerability Management': '#eab308',
  'Threat Hunting': '#06b6d4',
  'Frameworks & Standards': '#64748b',
  'Social Engineering': '#d946ef',
  'Malware Analysis': '#dc2626',
  'AI & Machine Learning': '#0ea5e9',
  'Threat Detection': '#10b981',
}

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
}

// LocalStorage keys
export const STORAGE_KEYS = {
  EXAM_HISTORY: 'csa_exam_history',
  PRACTICE_PROGRESS: 'csa_practice_progress',
  USER_PREFERENCES: 'csa_user_preferences',
  ANALYTICS: 'csa_analytics',
}

// Routes
export const ROUTES = {
  HOME: '/',
  PRACTICE: '/practice',
  EXAM: '/exam',
  REVIEW: '/review',
  ANALYTICS: '/analytics',
}

// Navigation items
export const NAV_ITEMS = [
  { path: ROUTES.HOME, label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: ROUTES.PRACTICE, label: 'Practice', icon: 'BookOpen' },
  { path: ROUTES.EXAM, label: 'Exam Mode', icon: 'Timer' },
  { path: ROUTES.ANALYTICS, label: 'Analytics', icon: 'BarChart3' },
]

// Question status
export const QUESTION_STATUS = {
  UNANSWERED: 'unanswered',
  CORRECT: 'correct',
  INCORRECT: 'incorrect',
  FLAGGED: 'flagged',
}

// Exam status
export const EXAM_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
}

// Practice mode filters
export const PRACTICE_FILTERS = {
  ALL: 'all',
  BY_CATEGORY: 'category',
  BY_DIFFICULTY: 'difficulty',
  RANDOM: 'random',
  FLAGGED: 'flagged',
  INCORRECT: 'incorrect',
}

// Time format options
export const TIME_FORMAT = {
  FULL: 'full', // HH:MM:SS
  MINUTES: 'minutes', // MM:SS
}

// Score thresholds for performance levels
export const PERFORMANCE_LEVELS = {
  EXCELLENT: { min: 90, label: 'Excellent', color: '#10b981' },
  GOOD: { min: 75, label: 'Good', color: '#06b6d4' },
  AVERAGE: { min: 60, label: 'Average', color: '#f59e0b' },
  NEEDS_IMPROVEMENT: { min: 0, label: 'Needs Improvement', color: '#ef4444' },
}

// Weak area threshold (percentage)
export const WEAK_AREA_THRESHOLD = 70

// Chart colors
export const CHART_COLORS = [
  '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
  '#ec4899', '#3b82f6', '#14b8a6', '#f97316', '#6366f1',
]

// Animation durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
}

// Debounce delay for search
export const SEARCH_DEBOUNCE_MS = 300