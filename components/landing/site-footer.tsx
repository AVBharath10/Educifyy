import Link from "next/link"
import { Sparkles, Twitter, Github, Linkedin, Slack } from "lucide-react"

export function SiteFooter() {
    return (
        <footer className="border-t border-[#EBE8DF] bg-[#FDFBF7] pt-20 pb-10 overflow-hidden relative">
            {/* Background Pattern Mockup (Subtle) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')]"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* 1. Social Icons */}
                <div className="flex justify-center gap-6 mb-20">
                    <Link
                        href="#"
                        className="w-14 h-14 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all transform hover:scale-110"
                    >
                        <Slack className="w-6 h-6" />
                    </Link>
                    <Link
                        href="#"
                        className="w-14 h-14 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all transform hover:scale-110"
                    >
                        <Twitter className="w-6 h-6" />
                    </Link>
                    <Link
                        href="#"
                        className="w-14 h-14 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all transform hover:scale-110"
                    >
                        <Github className="w-6 h-6" />
                    </Link>
                </div>

                {/* 2. Main Navigation Layout */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-start max-w-5xl mx-auto mb-20 gap-10 md:gap-0">
                    {/* Simple Links Group 1 */}
                    <div className="flex flex-col gap-8 md:flex-row md:gap-16 text-lg font-medium">
                        <Link href="/" className="hover:underline decoration-2 underline-offset-4">
                            Home
                        </Link>
                        <Link href="/catalog" className="hover:underline decoration-2 underline-offset-4">
                            Catalog
                        </Link>
                        <Link href="/teach" className="hover:underline decoration-2 underline-offset-4">
                            Teach
                        </Link>
                        <Link href="/about" className="hover:underline decoration-2 underline-offset-4">
                            About
                        </Link>
                    </div>

                    {/* Resources Column */}
                    <div className="flex flex-col gap-4">
                        <span className="text-lg font-bold">Resources</span>
                        <ul className="flex flex-col gap-2 text-neutral-500 font-medium">
                            <li>
                                <Link href="/community" className="hover:text-black transition-colors">
                                    Community
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-black transition-colors">
                                    Manifesto
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-black transition-colors">
                                    Docs
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-black transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-black transition-colors">
                                    Careers
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Simple Links Group 2 */}
                    <div className="text-lg font-medium">
                        <Link href="#" className="hover:underline decoration-2 underline-offset-4">
                            Contact
                        </Link>
                    </div>
                </div>

                {/* 3. Divider */}
                <div className="w-full h-px bg-black/10 mb-10"></div>

                {/* 4. Copyright & Legal */}
                <div className="text-center space-y-4 mb-20">
                    <p className="font-mono text-sm text-neutral-500">
                        © {new Date().getFullYear()} Educify - All rights reserved
                    </p>
                    <Link href="#" className="block font-mono text-sm text-neutral-500 hover:text-black hover:underline">
                        Privacy Policy
                    </Link>
                </div>

                {/* 5. Big Brand Logo */}
                <div className="flex justify-center items-center gap-4 select-none">
                    {/* Hand Wave Icon (Simulating the hand in the image) */}
                    <Sparkles className="w-12 h-12 md:w-20 md:h-20 text-black" strokeWidth={1.5} />
                    <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-black">
                        Educify
                    </h1>
                </div>
            </div>
        </footer>
    )
}
