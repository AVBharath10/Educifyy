'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, Settings, LogOut, User } from 'lucide-react'
import { useAuth } from '@/lib/useAuth'

export function TopBar() {
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

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
    <header className="sticky top-0 z-20 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        <div className="hidden md:flex flex-1 items-center gap-3 max-w-md group">
          <div className="p-2 rounded-lg bg-secondary/10 text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search for anything..."
            className="w-full bg-transparent border-none text-sm focus:outline-none placeholder:text-muted-foreground/50"
          />
        </div>

        <div className="relative ml-auto">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="flex items-center gap-3 pl-2 hover:bg-secondary/5 rounded-lg p-1 transition-colors"
          >
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold leading-none">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground mt-1 capitalize">{user?.role?.toLowerCase() || 'Student'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-fuchsia-600 to-pink-600 p-0.5 cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-pink-500/20">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="text-foreground/80" size={20} />
                )}
              </div>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-border/50 md:hidden">
                <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>

              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary/10 hover:text-primary transition-colors"
              >
                <User size={16} />
                Profile
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary/10 hover:text-primary transition-colors"
              >
                <Settings size={16} />
                Dashboard
              </Link>

              <div className="h-px bg-border/50 my-1" />

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left"
              >
                {loggingOut ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogOut size={16} />
                )}
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header >
  )
}
