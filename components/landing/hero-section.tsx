export function HeroSection() {
    return (
        <header className="relative pt-24 pb-32 overflow-hidden px-6">
            {/* Abstract Decoration Elements (Code/Terminal aesthetic) */}
            <div className="absolute top-20 right-0 opacity-10 pointer-events-none select-none font-mono text-xs hidden lg:block text-right leading-tight">
                import &#123; knowledge &#125; from &apos;educify&apos;;<br />
                const user = await Platform.connect();<br />
                user.upgradeSkill(&apos;full-stack&apos;);<br />
        // rendering new future...
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-white shadow-sm mb-8">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-sm font-medium text-neutral-600">
                        v2.0 is now live
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-[#1A1916] leading-[1.1] mb-8">
                    The open platform for <br />
                    <span className="text-neutral-400">limitless learning.</span>
                </h1>

                <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Educify is a dual-sided marketplace designed for the modern creator
                    economy. Host premium courses, stream live workshops, and certify the
                    next generation of engineers.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="w-full sm:w-auto bg-[#1A1916] text-[#FDFBF7] px-8 py-3.5 rounded-lg text-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
                        Start Learning
                    </button>
                    <button className="w-full sm:w-auto bg-white border border-[#D6D3CD] text-[#1A1916] px-8 py-3.5 rounded-lg text-lg font-medium shadow-sm hover:bg-neutral-50 hover:scale-105 active:scale-95 transition-all duration-200">
                        Become an Instructor
                    </button>
                </div>
            </div>
        </header>
    )
}
