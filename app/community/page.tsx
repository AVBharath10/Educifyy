'use client'

import { PageLayout } from '@/components/page-layout'
import { Users, MessageSquare, Heart, Share2, MoreHorizontal } from 'lucide-react'

// Mock Data for Community Feed
const posts = [
    {
        id: 1,
        author: {
            name: 'Sarah Chen',
            avatar: null,
            role: 'Student',
            time: '2h ago'
        },
        content: "Just finished the 'Advanced React Patterns' course! highly recommend it to anyone looking to level up their component composition skills. 🚀 #React #WebDev",
        likes: 24,
        comments: 5
    },
    {
        id: 2,
        author: {
            name: 'Michael Ross',
            avatar: null,
            role: 'Instructor',
            time: '5h ago'
        },
        content: "I'll be hosting a live Q&A session tomorrow at 10 AM PST to discuss the new Rust modules. Bring your questions! 🦀",
        likes: 85,
        comments: 12
    },
    {
        id: 3,
        author: {
            name: 'Jessica Lee',
            avatar: null,
            role: 'Student',
            time: '1d ago'
        },
        content: "Does anyone want to pair program on the System Design capstone project? I'm looking for a partner.",
        likes: 12,
        comments: 8
    }
]

export default function CommunityPage() {
    return (
        <PageLayout>
            <div className="p-6 md:p-12 max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EBE8DF] pb-8 mb-8">
                    <div>
                        <h1 className="text-3xl font-medium tracking-tight mb-2">Community</h1>
                        <p className="text-neutral-500">Connect with fellow learners and instructors</p>
                    </div>
                    <button className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors">
                        New Post
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        {posts.map(post => (
                            <div key={post.id} className="bg-white border border-[#EBE8DF] rounded-xl p-6 shadow-sm hover:border-neutral-300 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 font-medium border border-[#EBE8DF]">
                                            {post.author.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm text-[#1A1916]">{post.author.name}</h4>
                                            <p className="text-xs text-neutral-400">{post.author.role} • {post.author.time}</p>
                                        </div>
                                    </div>
                                    <button className="text-neutral-400 hover:text-black">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>

                                <p className="text-neutral-700 text-sm leading-relaxed mb-4">
                                    {post.content}
                                </p>

                                <div className="flex items-center gap-6 pt-4 border-t border-[#F5F5F5]">
                                    <button className="flex items-center gap-2 text-sm text-neutral-500 hover:text-red-500 transition-colors group">
                                        <Heart size={16} className="group-hover:fill-red-500" />
                                        <span>{post.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-sm text-neutral-500 hover:text-blue-500 transition-colors">
                                        <MessageSquare size={16} />
                                        <span>{post.comments}</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition-colors ml-auto">
                                        <Share2 size={16} />
                                        <span>Share</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white border border-[#EBE8DF] rounded-xl p-6 shadow-sm">
                            <h3 className="font-medium mb-4 flex items-center gap-2">
                                <Users size={18} />
                                Suggested Connections
                            </h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-neutral-100 border border-[#EBE8DF]"></div>
                                            <div>
                                                <p className="text-sm font-medium">Alex Morgan</p>
                                                <p className="text-xs text-neutral-400">Software Engineer</p>
                                            </div>
                                        </div>
                                        <button className="text-xs font-medium text-blue-600 hover:underline">Connect</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-[#F3F1EB] rounded-xl border border-[#EBE8DF]">
                            <h3 className="font-medium mb-2">Community Guidelines</h3>
                            <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
                                Be respectful, share knowledge, and help others grow. We are a community of lifelong learners.
                            </p>
                            <button className="text-xs font-medium text-black underline">Read full guidelines</button>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}
