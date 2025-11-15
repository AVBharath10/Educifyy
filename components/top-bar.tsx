'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/useAuth'

export function TopBar() {
  const router = useRouter()
  const { logout, isLoading } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      await logout()
      router.push('/auth/login')
    } catch (e) {
      console.error('Logout failed', e)
      setLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-20 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        <div className="hidden md:flex flex-1 items-center gap-2 max-w-md">
          <Search size={18} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <button className="p-2 rounded-lg hover:bg-card border border-transparent hover:border-border transition-all">
            <Bell size={20} />
          </button>

          <button className="p-2 rounded-lg hover:bg-card border border-transparent hover:border-border transition-all">
            <Settings size={20} />
          </button>

          <button
            onClick={handleLogout}
            disabled={loggingOut || isLoading}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-card border border-transparent hover:border-border transition-all"
            aria-label="Logout"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>

          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent glow-blue" />
        </div>
      </div>
    </header>
  )
}
