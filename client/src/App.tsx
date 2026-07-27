import { useState } from 'react'
import Landing from './components/Landing'
import Auth from './components/Auth'
import CustomerApp from './components/CustomerApp'
import StaffDashboard from './components/StaffDashboard'
import AIChatBot from './components/AIChatBot'
import type { AppView, User } from './types'

export default function App() {
  const [view, setView] = useState<AppView>('landing')
  const [user, setUser] = useState<User | null>(null)

  const handleAuthSuccess = (authUser: User, role: 'customer' | 'staff') => {
    setUser(authUser)
    setView(role === 'staff' ? 'staff' : 'customer')
  }

  const handleLogout = () => {
    setUser(null)
    setView('landing')
  }

  return (
    <>
      {view === 'landing' && (
        <Landing
          onGetStarted={() => setView('auth')}
          onStaffLogin={() => setView('auth')}
        />
      )}
      {/* AI chatbot — present on all pages */}
      <AIChatBot view={view} userName={user?.name} />

      {view === 'auth' && (
        <Auth
          onSuccess={handleAuthSuccess}
          onBack={() => setView('landing')}
          initialMode="login"
        />
      )}

      {view === 'customer' && user && (
        <CustomerApp user={user} onLogout={handleLogout} />
      )}

      {view === 'staff' && user && (
        <StaffDashboard user={user} onLogout={handleLogout} />
      )}

      
    </>
  )
}
