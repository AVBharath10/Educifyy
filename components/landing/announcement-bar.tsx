import Link from "next/link"

export function AnnouncementBar() {
    return (
        <div className="bg-[#FFF848] border-b border-[#EBE8DF] px-4 py-3 flex justify-center items-center text-center">
            <p className="text-sm font-medium tracking-tight text-[#1A1916]">
                <span className="font-mono uppercase text-xs mr-2 border border-black/10 px-1.5 py-0.5 rounded-sm bg-white/50">
                    New
                </span>
                We&apos;ve just launched the Instructor Studio 2.0.{" "}
                <Link
                    href="#"
                    className="underline decoration-1 underline-offset-2 hover:decoration-black"
                >
                    Read the changelog
                </Link>
            </p>
        </div>
    )
}
