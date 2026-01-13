'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Bell, Search, ChevronRight, Flame, Menu } from 'lucide-react'
import { useAuth } from '@/lib/useAuth'

export function TopBar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()

  // Format breadcrumbs from pathname
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`
    const isLast = index === segments.length - 1
    const title = segment.charAt(0).toUpperCase() + segment.slice(1)

    return { href, title, isLast }
  })

  // Mock streak if not available
  const streak = user?.currentStreak || 0

  return (
    <header className="h-16 flex items-center justify-between px-6 md:px-8 border-b border-[#EBE8DF] bg-white/50 backdrop-blur-sm z-10 sticky top-0">
      {/* Breadcrumbs / Mobile Menu Placeholder */}
      <div className="flex items-center gap-4">
        {/* Note: Mobile menu trigger is handled by SidebarNav for now */}
        <nav className="hidden md:flex items-center text-sm font-medium text-neutral-500">
          <Link href="/" className="hover:text-black cursor-pointer transition-colors">Home</Link>
          {breadcrumbs.length > 0 && <ChevronRight className="w-4 h-4 mx-2 text-neutral-400" />}

          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center">
              {index > 0 && <ChevronRight className="w-4 h-4 mx-2 text-neutral-400" />}
              {crumb.isLast ? (
                <span className="text-black">{crumb.title}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-black cursor-pointer transition-colors">
                  {crumb.title}
                </Link>
              )}
            </div>
          ))}
          {breadcrumbs.length === 0 && <span className="text-black">Dashboard</span>}
        </nav>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden sm:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-black transition-colors" />
          <input
            type="text"
            placeholder="Search anything..."
            className="pl-10 pr-4 py-1.5 border border-[#EBE8DF] rounded-full text-sm w-64 bg-transparent focus:outline-none focus:border-neutral-400 focus:bg-white transition-all placeholder:text-neutral-400"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            <span className="text-[10px] font-mono border border-neutral-200 rounded px-1 text-neutral-400">⌘K</span>
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-100 rounded-full text-sm font-medium">
          <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-600" />
          <span>{streak} Days</span>
        </div>

        {/* Notifications */}
        <button className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#FDFBF7]"></span>
        </button>
      </div>
    </header>
  )
}
