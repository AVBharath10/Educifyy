import { AnnouncementBar } from "@/components/landing/announcement-bar"
import { SiteHeader } from "@/components/landing/site-header"
import { HeroSection } from "@/components/landing/hero-section"
import { FeatureGrid } from "@/components/landing/feature-grid"
import { CourseCatalogPreview } from "@/components/landing/course-catalog-preview"
import { PlatformPreview } from "@/components/landing/platform-preview"
import { CTASection } from "@/components/landing/cta-section"
import { SiteFooter } from "@/components/landing/site-footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <FeatureGrid />
        <CourseCatalogPreview />
        <PlatformPreview />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  )
}
