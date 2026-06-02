import { Metadata } from "next"
import Link from "next/link"
import { useTranslations } from "next-intl"

export const metadata = {
  title: "Ketentuan Layanan - Aiuiso",
  description: "Syarat dan ketentuan penggunaan layanan streaming video Aiuiso.",
}

const TermsPage = () => {
  const t = useTranslations("Legal")
  const tT = useTranslations("TOSFull")

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl min-h-[80vh]">
      <h1 className="text-4xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-4">
        {t("tosTitle")}
      </h1>
      
      <div className="space-y-8 text-white/70 leading-relaxed text-sm md:text-base">
        <section>
          <h2 className="text-2xl font-bold text-purple-400 mb-3">{tT("s1Title")}</h2>
          <p>
            {tT("s1P1")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-purple-400 mb-3">{tT("s2Title")}</h2>
          <p>
            {tT("s2P1")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-purple-400 mb-3">{tT("s3Title")}</h2>
          <p>
            {tT("s3P1")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-purple-400 mb-3">{tT("s4Title")}</h2>
          <p>
            {tT("s4P1")} <Link href="/dmca" className="text-cyan-400 hover:underline">DMCA</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-purple-400 mb-3">{tT("s5Title")}</h2>
          <p>{tT("s5P1")}</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>{tT("s5L1")}</li>
            <li>{tT("s5L2")}</li>
            <li>{tT("s5L3")}</li>
            <li>{tT("s5L4")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-purple-400 mb-3">{tT("s6Title")}</h2>
          <p>
            {tT("s6P1")}
          </p>
        </section>

        <div className="mt-12 pt-8 border-t border-white/10 text-sm">
          <p className="mb-2">Aiuiso © {new Date().getFullYear()}</p>
          <p>
            {tT("contactPrompt")} <Link href="/contact" className="text-cyan-400 hover:underline">Aiuiso</Link>.
          </p>
        </div>
      </div>
    </main>
  )
}

export default TermsPage;
