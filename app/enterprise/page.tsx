import { SiteLayout } from "@/components/layouts/site-layout"
import { Building2, CheckCircle, BarChart, Shield } from "lucide-react"

export default function EnterprisePage() {
    return (
        <SiteLayout>
            <div className="bg-[#1A1916] text-[#FDFBF7]">
                {/* Dark Hero */}
                <div className="max-w-7xl mx-auto px-6 py-32">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium mb-6">
                            <Building2 size={16} />
                            <span>Educify for Business</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-8 leading-tight">
                            Upskill your team <br /> with world-class content.
                        </h1>
                        <p className="text-xl text-neutral-400 mb-10 max-w-xl leading-relaxed">
                            Give your employees unlimited access to over 5,000+ top courses. Track progress, assign learning paths, and drive innovation.
                        </p>
                        <button className="bg-[#FDFBF7] text-black px-8 py-4 rounded-lg text-lg font-medium hover:bg-white transition-all shadow-lg shadow-white/5">
                            Book a Demo
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-medium mb-6 text-[#1A1916]">Why leading companies choose Educify</h2>
                            <div className="space-y-6">
                                {[
                                    { title: 'Curated Content', desc: 'Access the top 1% of courses, hand-picked for quality.', icon: CheckCircle },
                                    { title: 'Advanced Analytics', desc: 'Track usage, completion rates, and skill acquisition in real-time.', icon: BarChart },
                                    { title: 'Enterprise Security', desc: 'SSO, SOC2 compliance, and advanced data protection.', icon: Shield }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="mt-1 text-black">
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium mb-1 text-[#1A1916]">{item.title}</h3>
                                            <p className="text-neutral-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-[#FDFBF7] border border-[#EBE8DF] rounded-2xl p-8 h-96 flex items-center justify-center">
                            <div className="text-center text-neutral-400">
                                <BarChart size={48} className="mx-auto mb-4 opacity-50" />
                                <p>Analytics Dashboard Mockup</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SiteLayout>
    )
}
