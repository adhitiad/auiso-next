import Link from "next/link"
import { useTranslations } from "next-intl"

export const Footer = () => {
  const t = useTranslations("Footer")
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 bg-black/40 backdrop-blur-md text-white py-12 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-serif text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AIUISO
            </span>
            <p className="text-sm text-white/40">
              &copy; {currentYear} AIUISO. All rights reserved.
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/40">
            <Link href="/faq" className="hover:text-purple-400 transition-colors">{t("faq")}</Link>
            <Link href="/privacy" className="hover:text-purple-400 transition-colors">{t("privacy")}</Link>
            <Link href="/terms" className="hover:text-purple-400 transition-colors">{t("tos")}</Link>
            <Link href="/dmca" className="hover:text-purple-400 transition-colors">{t("dmca")}</Link>
            <Link href="/contact" className="hover:text-purple-400 transition-colors">{t("contact")}</Link>
          </nav>
        </div>
        <div className="mt-8 text-center text-xs text-white/20">
          {t("disclaimer")}
        </div>
      </div>
    </footer>
  )
}
