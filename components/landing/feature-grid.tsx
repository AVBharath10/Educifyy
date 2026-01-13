import { Users, Zap, Award } from "lucide-react"

export function FeatureGrid() {
    return (
        <section className="py-24 max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white border border-[#EBE8DF] p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-lg flex items-center justify-center mb-6">
                        <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-medium mb-3 tracking-tight">
                        Community Driven
                    </h3>
                    <p className="text-lg text-neutral-500 leading-relaxed">
                        Join cohort-based groups, participate in peer reviews, and grow
                        together in real-time.
                    </p>
                </div>
                <div className="bg-white border border-[#EBE8DF] p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 text-blue-900 rounded-lg flex items-center justify-center mb-6">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-medium mb-3 tracking-tight">
                        Instant Streaming
                    </h3>
                    <p className="text-lg text-neutral-500 leading-relaxed">
                        Low-latency video playback with adaptive bitrate streaming powered by
                        edge networks.
                    </p>
                </div>
                <div className="bg-white border border-[#EBE8DF] p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-100 text-green-900 rounded-lg flex items-center justify-center mb-6">
                        <Award className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-medium mb-3 tracking-tight">
                        Verified Certificates
                    </h3>
                    <p className="text-lg text-neutral-500 leading-relaxed">
                        Earn blockchain-backed credentials that you can showcase on LinkedIn
                        and your resume.
                    </p>
                </div>
            </div>
        </section>
    )
}
