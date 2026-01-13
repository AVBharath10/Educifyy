import { SiteHeader } from "@/components/landing/site-header"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <SiteHeader />
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}
