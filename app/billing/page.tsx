'use client'

import { PageLayout } from '@/components/page-layout'
import { CreditCard, Check, AlertCircle, Download, Plus } from 'lucide-react'

export default function BillingPage() {
    return (
        <PageLayout>
            <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight mb-2">Billing & Plans</h1>
                    <p className="text-neutral-500">Manage your subscription and payment methods</p>
                </div>

                {/* Current Plan */}
                <div className="bg-[#1A1916] text-[#FDFBF7] rounded-xl p-8 relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-medium border border-white/20 mb-3">CURRENT PLAN</span>
                            <h2 className="text-3xl font-bold mb-2">Pro Membership</h2>
                            <p className="text-neutral-400">$19/month • Renews on Feb 14, 2026</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-5 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors">
                                Manage Plan
                            </button>
                            <button className="px-5 py-2.5 bg-transparent border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/10 grid md:grid-cols-3 gap-6">
                        <div>
                            <h4 className="font-medium mb-1">Unlimited Access</h4>
                            <p className="text-xs text-neutral-400">Access to all 150+ courses</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Certificates</h4>
                            <p className="text-xs text-neutral-400">Verified completion badges</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Offline Viewing</h4>
                            <p className="text-xs text-neutral-400">Download courses on mobile</p>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white border border-[#EBE8DF] rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium">Payment Method</h3>
                        <button className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
                            <Plus size={14} /> Add New
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-[#EBE8DF] rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-8 bg-[#F3F1EB] rounded border border-[#EBE8DF] flex items-center justify-center">
                                <CreditCard size={16} className="text-neutral-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Visa ending in 4242</p>
                                <p className="text-xs text-neutral-500">Expiry 12/28</p>
                            </div>
                        </div>
                        <span className="text-xs font-medium bg-neutral-100 px-2 py-1 rounded text-neutral-600">Default</span>
                    </div>
                </div>

                {/* Invoice History */}
                <div className="bg-white border border-[#EBE8DF] rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-medium mb-6">Invoice History</h3>
                    <div className="space-y-1">
                        {[
                            { date: 'Jan 14, 2026', amount: '$19.00', status: 'Paid', id: 'INV-2024-001' },
                            { date: 'Dec 14, 2025', amount: '$19.00', status: 'Paid', id: 'INV-2023-012' },
                            { date: 'Nov 14, 2025', amount: '$19.00', status: 'Paid', id: 'INV-2023-011' },
                        ].map(invoice => (
                            <div key={invoice.id} className="flex items-center justify-between py-3 px-2 hover:bg-neutral-50 rounded-lg transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                        <Check size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{invoice.date}</p>
                                        <p className="text-xs text-neutral-500">{invoice.id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-sm font-medium">{invoice.amount}</span>
                                    <button className="p-2 text-neutral-400 hover:text-black transition-colors opacity-0 group-hover:opacity-100">
                                        <Download size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </PageLayout>
    )
}
