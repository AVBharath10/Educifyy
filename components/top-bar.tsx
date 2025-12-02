'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, Settings, LogOut, User } from 'lucide-react'
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

        <div className="flex items-center gap-3 ml-auto">
          <button className="p-2.5 rounded-full hover:bg-secondary/10 text-muted-foreground hover:text-foreground transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-background" />
          </button>

          <button className="p-2.5 rounded-full hover:bg-secondary/10 text-muted-foreground hover:text-foreground transition-all">
            <Settings size={20} />
          </button>

          <div className="h-6 w-px bg-border/50 mx-2" />

          <div className="flex items-center gap-3 pl-2">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold leading-none">User</p>
              <p className="text-xs text-muted-foreground mt-1">Student</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-fuchsia-600 to-pink-600 p-0.5 cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-pink-500/20">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                <User className="text-foreground/80" size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
