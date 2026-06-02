import { Metadata } from "next"
import Link from "next/link"
import { useTranslations } from "next-intl"

export const metadata: Metadata = {
  title: "Kebijakan Privasi - Aiuiso",
  description: "Kebijakan privasi dan pengelolaan data pengguna di Aiuiso.",
}

const PrivacyPolicyPage = () => {
  const t = useTranslations("Legal")
  const tP = useTranslations("PrivacyFull")

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl min-h-[80vh]">
      <h1 className="text-4xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-4">
        {t("privacyTitle")}
      </h1>
      
      <div className="space-y-8 text-white/70 leading-relaxed text-sm md:text-base">
        <section>
          <h2 className="text-2xl font-bold text-purple-400 mb-3">{tP("introTitle")}</h2>
          <p>
            {tP("intro")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-purple-400 mb-3">{tP("s1Title")}</h2>
          <p>{tP("s1P1")}</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>{tP("s1L1")}</li>
            <li>{tP("s1L2")}</li>
            <li>{tP("s1L3")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-purple-400 mb-3">{tP("s2Title")}</h2>
          <p>{tP("s2P1")}</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>{tP("s2L1")}</li>
            <li>{tP("s2L2")}</li>
            <li>{tP("s2L3")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-purple-400 mb-3">{tP("s3Title")}</h2>
          <p>
            {tP("s3P1")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-purple-400 mb-3">{tP("s4Title")}</h2>
          <p>
            {tP("s4P1")}
          </p>
        </section>

        <div className="mt-12 pt-8 border-t border-white/10 text-sm">
          <p className="mb-2">{tP("lastUpdated")} {new Date().toLocaleDateString("id-ID")}</p>
          <p>
            {tP("contactPrompt")} <Link href="/contact" className="text-cyan-400 hover:underline">Aiuiso</Link>.
          </p>
        </div>
      </div>
    </main>
  )
}

export default PrivacyPolicyPage;
