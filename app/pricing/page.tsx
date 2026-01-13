import { SiteLayout } from "@/components/layouts/site-layout"
import { Check } from "lucide-react"

export default function PricingPage() {
    return (
        <SiteLayout>
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-[#1A1916]">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-lg text-neutral-500">
                        Start for free, upgrade when you need more. No hidden fees.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Free Tier */}
                    <div className="p-8 rounded-2xl border border-[#EBE8DF] bg-white shadow-sm flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-xl font-medium mb-2">Free</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-semibold">$0</span>
                                <span className="text-neutral-500">/month</span>
                            </div>
                        </div>
                        <p className="text-neutral-500 mb-8 text-sm">Perfect for getting started with learning.</p>
                        <ul className="space-y-4 mb-8 flex-1">
                            {['Access to free courses', 'Community support', 'Basic profile', 'Mobile access'].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-sm">
                                    <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-black">
                                        <Check size={12} />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-3 rounded-lg border border-[#EBE8DF] font-medium hover:bg-neutral-50 transition-colors">
                            Get Started
                        </button>
                    </div>

                    {/* Pro Tier */}
                    <div className="p-8 rounded-2xl border border-[#1A1916] bg-[#1A1916] text-[#FDFBF7] shadow-xl flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#FDFBF7] text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                            POPULAR
                        </div>
                        <div className="mb-6">
                            <h3 className="text-xl font-medium mb-2">Pro</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-semibold">$19</span>
                                <span className="text-neutral-400">/month</span>
                            </div>
                        </div>
                        <p className="text-neutral-400 mb-8 text-sm">Everything you need to master new skills.</p>
                        <ul className="space-y-4 mb-8 flex-1">
                            {['Unlimited course access', 'Certificates of completion', 'Offline downloads', 'Priority support', 'Exclusive workshops'].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-sm">
                                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white">
                                        <Check size={12} />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-3 rounded-lg bg-[#FDFBF7] text-black font-medium hover:bg-white transition-colors">
                            Start Pro Trial
                        </button>
                    </div>

                    {/* Enterprise Tier */}
                    <div className="p-8 rounded-2xl border border-[#EBE8DF] bg-white shadow-sm flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-xl font-medium mb-2">Team</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-semibold">$49</span>
                                <span className="text-neutral-500">/month</span>
                            </div>
                        </div>
                        <p className="text-neutral-500 mb-8 text-sm">For teams and organizations.</p>
                        <ul className="space-y-4 mb-8 flex-1">
                            {['Everything in Pro', 'Team management', 'Analytics dashboard', 'SSO Integration', 'Dedicated success manager'].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-sm">
                                    <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-black">
                                        <Check size={12} />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-3 rounded-lg border border-[#EBE8DF] font-medium hover:bg-neutral-50 transition-colors">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </div>
        </SiteLayout>
    )
}
