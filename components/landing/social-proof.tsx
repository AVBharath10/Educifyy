import { Triangle, Box, Hexagon, Layers, Command } from "lucide-react"

export function SocialProof() {
    return (
        <div className="border-y border-[#EBE8DF] bg-white/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <p className="text-center font-mono text-sm text-neutral-500 mb-8 uppercase tracking-wider">
                    Trusted by engineers at
                </p>
                <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-60 grayscale">
                    {/* Simple SVG Placeholders for Brands via Lucide Icons */}
                    <div className="flex items-center gap-2 font-semibold text-xl">
                        <Triangle className="fill-current" /> Vercel
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-xl">
                        <Box className="fill-current" /> Linear
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-xl">
                        <Hexagon className="fill-current" /> Node
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-xl">
                        <Layers className="fill-current" /> Stack
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-xl">
                        <Command className="fill-current" /> Raycast
                    </div>
                </div>
            </div>
        </div>
    )
}
