'use client'

import { ReactNode } from 'react'
import { SidebarNav } from './sidebar-nav'
import { TopBar } from './top-bar'

interface PageLayoutProps {
  children: ReactNode
  showTopBar?: boolean
}

export function PageLayout({ children, showTopBar = true }: PageLayoutProps) {
  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex-1 flex flex-col md:ml-64 overflow-hidden">
        {showTopBar && <TopBar />}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
