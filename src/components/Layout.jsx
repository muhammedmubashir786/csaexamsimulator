import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  BookOpen, 
  Timer, 
  BarChart3, 
  Shield,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { ROUTES, NAV_ITEMS } from '../utils/constants'

/**
 * Layout Component
 * Provides consistent navigation and structure across all pages
 * Includes responsive sidebar navigation and header
 */
function Layout({ children }) {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Get icon component by name
  const getIcon = (iconName) => {
    const icons = {
      LayoutDashboard,
      BookOpen,
      Timer,
      BarChart3,
    }
    const Icon = icons[iconName]
    return Icon ? <Icon className="w-5 h-5" /> : null
  }

  // Check if route is active
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-cyber-bg flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-cyber-card border-r border-cyber-border fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-cyber-border">
          <Link to={ROUTES.HOME} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-primary to-cyber-secondary flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">CSA Exam</h1>
              <p className="text-xs text-cyber-muted">Simulator</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/30'
                  : 'text-cyber-muted hover:bg-cyber-border/50 hover:text-white'
              }`}
            >
              {getIcon(item.icon)}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-cyber-border">
          <p className="text-xs text-cyber-muted text-center">
            CSA Exam Simulator v1.0
          </p>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-cyber-card border-b border-cyber-border">
        <div className="flex items-center justify-between p-4">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-primary to-cyber-secondary flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">CSA Exam</span>
          </Link>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-cyber-muted hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="border-t border-cyber-border p-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-cyber-primary/20 text-cyber-primary'
                    : 'text-cyber-muted hover:bg-cyber-border/50 hover:text-white'
                }`}
              >
                {getIcon(item.icon)}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
