'use client'

import { PageLayout } from '@/components/page-layout'
import { FileCheck, Download, ExternalLink, Calendar } from 'lucide-react'

const certificates = [
    {
        id: 'cert_123',
        courseName: 'Advanced React Patterns',
        instructor: 'Kent C. Dodds',
        issueDate: 'Oct 12, 2025',
        grade: '98%',
        skills: ['React', 'Composition', 'Performance'],
        preview: 'https://placehold.co/600x400/EEE/31343C?text=Certificate',
    }
]

export default function CertificatesPage() {
    return (
        <PageLayout>
            <div className="p-6 md:p-12 max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EBE8DF] pb-8 mb-8">
                    <div>
                        <h1 className="text-3xl font-medium tracking-tight mb-2">Certificates</h1>
                        <p className="text-neutral-500">Showcase your professional milestones</p>
                    </div>
                </div>

                {certificates.length > 0 ? (
                    <div className="space-y-6">
                        {certificates.map(cert => (
                            <div key={cert.id} className="bg-white border border-[#EBE8DF] rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row">
                                    {/* Preview */}
                                    <div className="md:w-64 bg-neutral-100 flex items-center justify-center border-r border-[#EBE8DF]">
                                        <FileCheck className="w-12 h-12 text-neutral-300" />
                                    </div>

                                    {/* Details */}
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-semibold tracking-tight">{cert.courseName}</h3>
                                                <span className="font-mono text-sm bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">Verified</span>
                                            </div>
                                            <p className="text-neutral-500 mb-4">Instructor: {cert.instructor}</p>

                                            <div className="flex gap-2 mb-6">
                                                {cert.skills.map(skill => (
                                                    <span key={skill} className="px-2 py-1 bg-neutral-50 text-neutral-600 text-xs rounded border border-[#EBE8DF]">{skill}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-[#F5F5F5] mt-auto">
                                            <div className="flex items-center gap-2 text-sm text-neutral-500">
                                                <Calendar size={14} />
                                                <span>Issued {cert.issueDate}</span>
                                            </div>
                                            <div className="flex gap-3">
                                                <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-[#EBE8DF] rounded hover:bg-neutral-50 transition-colors">
                                                    <Download size={14} /> PDF
                                                </button>
                                                <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-black text-white border border-black rounded hover:bg-neutral-800 transition-colors">
                                                    <ExternalLink size={14} /> Verify
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-[#EBE8DF]">
                        <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileCheck className="w-8 h-8 text-neutral-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No certificates yet</h3>
                        <p className="text-neutral-500 mb-6 max-w-sm mx-auto">Complete courses and pass the final exam to earn verified certificates.</p>
                        <Link href="/my-courses">
                            <button className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors">
                                Resume Learning
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </PageLayout>
    )
}

import Link from 'next/link'
