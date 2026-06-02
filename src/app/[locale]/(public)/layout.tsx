import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AntiAdBlock } from "@/components/features/ads/anti-adblock"
import { PrivacyConsentBanner } from "@/components/features/pwa/privacy-consent-banner"

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-night-bg text-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <AntiAdBlock />
      <PrivacyConsentBanner />
    </div>
  )
}


export default PublicLayout;
