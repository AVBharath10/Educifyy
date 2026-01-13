export function CTASection() {
    return (
        <section className="py-32 px-6">
            <div className="max-w-4xl mx-auto text-center bg-[#1A1916] text-[#FDFBF7] rounded-2xl p-12 md:p-20 relative overflow-hidden">
                {/* Decorative circle */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 relative z-10">
                    Ready to start teaching?
                </h2>
                <p className="text-xl text-neutral-400 mb-10 max-w-xl mx-auto relative z-10">
                    Join thousands of instructors sharing their knowledge. Monetize your
                    skills with our 85% revenue share model.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                    <button className="bg-[#FFF848] text-black px-8 py-3.5 rounded-lg text-lg font-medium shadow-lg hover:bg-[#fffa70] transition-colors">
                        Create Instructor Account
                    </button>
                </div>
            </div>
        </section>
    )
}
