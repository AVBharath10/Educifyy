'use client'

import React from 'react'
import Link from "next/link"
import { Sparkles, ArrowRight, Loader2, LayoutDashboard } from "lucide-react"
import { useAuth } from "@/lib/useAuth"

export function SiteHeader() {
  const { isAuthenticated, isInitialized } = useAuth()

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#FDFBF7]/80 border-b border-[#EBE8DF]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-[#1A1916] text-[#FDFBF7] flex items-center justify-center rounded-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-semibold tracking-tight">Educify</span>
        </Link>

        {/* Center: Navigation */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link
            href="/"
            className="text-base font-medium text-neutral-600 hover:text-black transition-colors"
          >
            Home
          </Link>
          <Link
            href="/catalog"
            className="text-base font-medium text-neutral-600 hover:text-black transition-colors"
          >
            Catalog
          </Link>
          <Link
            href="/teach"
            className="text-base font-medium text-neutral-600 hover:text-black transition-colors"
          >
            Teach
          </Link>
          <Link
            href="/about"
            className="text-base font-medium text-neutral-600 hover:text-black transition-colors"
          >
            About
          </Link>
          <Link
            href="#"
            className="text-base font-medium text-neutral-600 hover:text-black transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 flex-shrink-0 min-w-[140px] justify-end">
          {!isInitialized ? (
            <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
          ) : isAuthenticated ? (
            <Link href="/dashboard">
              <button className="bg-[#1A1916] text-[#FDFBF7] px-6 py-2.5 rounded-lg text-base font-medium shadow-sm hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 hover:shadow-lg hover:shadow-black/20">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <button className="hidden md:block text-base font-medium hover:text-black hover:scale-105 active:scale-95 transition-all px-4 py-2 rounded-lg hover:bg-neutral-50">
                  Log in
                </button>
              </Link>
              <Link href="/auth/signup">
                <button className="bg-[#1A1916] text-[#FDFBF7] px-6 py-2.5 rounded-lg text-base font-medium shadow-sm hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 hover:shadow-lg hover:shadow-black/20">
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
