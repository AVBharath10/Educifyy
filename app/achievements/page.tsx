'use client'

import { PageLayout } from '@/components/page-layout'
import { Trophy, Star, Target, Zap, Lock, Crown } from 'lucide-react'

const badges = [
    { id: 1, name: 'Early Adopter', description: 'Joined during the beta phase', icon: Star, unlocked: true, color: 'text-yellow-500 bg-yellow-50' },
    { id: 2, name: 'Fast Learner', description: 'Completed a course in 3 days', icon: Zap, unlocked: true, color: 'text-blue-500 bg-blue-50' },
    { id: 3, name: 'Code Wrapper', description: 'Submitted 10 coding exercises', icon: Target, unlocked: true, color: 'text-green-500 bg-green-50' },
    { id: 4, name: 'Course Master', description: 'Complete 5 courses', icon: Trophy, unlocked: false, color: 'text-neutral-300 bg-neutral-50' },
    { id: 5, name: 'Community Pillar', description: 'Receive 50 likes on posts', icon: Crown, unlocked: false, color: 'text-neutral-300 bg-neutral-50' },
    { id: 6, name: 'Streak Master', description: 'Maintain a 30-day streak', icon: Flame, unlocked: false, color: 'text-neutral-300 bg-neutral-50' },
]

import { Flame } from 'lucide-react'

export default function AchievementsPage() {
    return (
        <PageLayout>
            <div className="p-6 md:p-12 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EBE8DF] pb-8 mb-8">
                    <div>
                        <h1 className="text-3xl font-medium tracking-tight mb-2">Achievements</h1>
                        <p className="text-neutral-500">Track your progress and earn rewards</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-[#EBE8DF] shadow-sm">
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-neutral-500 uppercase tracking-widest font-mono">Total XP</span>
                            <span className="text-xl font-bold font-mono">14,250</span>
                        </div>
                        <div className="w-10 h-10 bg-black text-yellow-400 rounded-full flex items-center justify-center">
                            <Star size={20} fill="currentColor" />
                        </div>
                    </div>
                </div>

                {/* Level Progress */}
                <div className="bg-white border border-[#EBE8DF] rounded-xl p-8 mb-12 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-gradient-to-br from-neutral-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <span className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Current Level</span>
                                <h2 className="text-4xl font-bold mt-1">Level 5</h2>
                            </div>
                            <span className="text-sm font-mono text-neutral-500">750 XP to Level 6</span>
                        </div>

                        <div className="h-4 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                            <div className="h-full bg-gradient-to-r from-neutral-800 to-black w-[65%] rounded-full relative">
                                <div className="absolute top-0 right-0 bottom-0 w-1 bg-white opacity-20"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Badges Grid */}
                <h3 className="text-xl font-medium mb-6">Badges</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {badges.map(badge => (
                        <div key={badge.id} className={`p-6 rounded-xl border ${badge.unlocked ? 'border-[#EBE8DF] bg-white' : 'border-dashed border-neutral-200 bg-neutral-50/50'} flex items-start gap-4 transition-all hover:bg-opacity-50`}>
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${badge.color}`}>
                                {badge.unlocked ? <badge.icon size={24} /> : <Lock size={20} className="text-neutral-400" />}
                            </div>
                            <div>
                                <h4 className={`font-medium ${badge.unlocked ? 'text-black' : 'text-neutral-400'}`}>{badge.name}</h4>
                                <p className="text-sm text-neutral-500 mt-1 leading-snug">{badge.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </PageLayout>
    )
}
