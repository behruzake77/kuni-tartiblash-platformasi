import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { Hero } from "@/components/marketing/hero";
import { ProductPreview } from "@/components/marketing/product-preview";
import { VideoGuide } from "@/components/marketing/video-guide";
import { Features } from "@/components/marketing/features";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Pricing } from "@/components/marketing/pricing";
import { CtaBand } from "@/components/marketing/cta-band";

/**
 * Ordo Marketing Home
 * Implementation order per Design Bible Phase 7:
 * tokens → layout → components → marketing home
 */

export default function HomePage() {
  return (
    <>
      <MarketingHeader />
      <main id="main">
        <Hero />
        <ProductPreview />
        <VideoGuide />
        <Features />
        <HowItWorks />
        <Pricing />
        <CtaBand />
      </main>
      <MarketingFooter />
    </>
  );
}
