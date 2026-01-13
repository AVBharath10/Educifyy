import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"

interface SiteLayoutProps {
    children: React.ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
            <SiteHeader />
            <main className="flex-1">
                {children}
            </main>
            <SiteFooter />
        </div>
    )
}
