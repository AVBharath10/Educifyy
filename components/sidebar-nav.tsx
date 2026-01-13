'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutGrid,
  BookOpen,
  Compass,
  Users,
  Trophy,
  FileCheck,
  CreditCard,
  Settings,
  Sparkles,
  Menu,
  X,
  LogOut,
  BarChart,
  Video
} from 'lucide-react'
import { useAuth } from '@/lib/useAuth'

const platformItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/my-courses', label: 'My Courses', icon: BookOpen },
  { href: '/catalog', label: 'Explore', icon: Compass },
  { href: '/community', label: 'Community', icon: Users },
]

const teachingItems = [
  { href: '/upload', label: 'Studio', icon: Video },
  { href: '/analytics', label: 'Analytics', icon: BarChart },
]

const personalItems = [
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/certificates', label: 'Certificates', icon: FileCheck },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/profile', label: 'Settings', icon: Settings },
]

export function SidebarNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      setIsOpen(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const isInstructor = user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN'

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg md:hidden bg-white hover:bg-neutral-50 border border-[#EBE8DF]"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white/50 backdrop-blur-sm border-r border-[#EBE8DF] flex flex-col transform transition-transform md:translate-x-0 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-[#EBE8DF]">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 bg-[#1A1916] text-[#FDFBF7] flex items-center justify-center rounded-md">
              <Sparkles className="w-3 h-3" />
            </div>
            <span className="text-base font-semibold tracking-tight text-[#1A1916]">Educify</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-3 text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2">Platform</p>

          {platformItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all group ${isActive
                    ? 'bg-[#F3F1EB] text-black'
                    : 'text-neutral-600 hover:text-black hover:bg-neutral-100 hover:pl-4'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}

          {isInstructor && (
            <div className="pt-6">
              <p className="px-3 text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2">Teaching</p>
              {teachingItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all ${isActive
                        ? 'bg-[#F3F1EB] text-black'
                        : 'text-neutral-600 hover:text-black hover:bg-neutral-100 hover:pl-4'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )}

          <div className="pt-6">
            <p className="px-3 text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2">Personal</p>
            {personalItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all ${isActive
                      ? 'bg-[#F3F1EB] text-black'
                      : 'text-neutral-600 hover:text-black hover:bg-neutral-100 hover:pl-4'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* User Profile (Bottom) */}
        <div className="p-4 border-t border-[#EBE8DF]">
          <div className="flex items-center gap-3 p-2 rounded-lg border border-[#EBE8DF] bg-white shadow-sm cursor-pointer hover:border-neutral-300 transition-colors group relative">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center text-white text-xs font-medium overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate text-[#1A1916]">{user?.name || 'User'}</p>
              <p className="text-xs text-neutral-500 truncate">{user?.role === 'INSTRUCTOR' ? 'Instructor' : 'Pro Member'}</p>
            </div>
            <button onClick={handleLogout} className="text-neutral-400 hover:text-red-500 transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
