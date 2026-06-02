import { useTranslations } from "next-intl"

export const metadata = {
  title: "Kebijakan DMCA - Aiuiso",
  description: "Pemberitahuan dan Kebijakan Digital Millennium Copyright Act (DMCA).",
}

const DMCAPage = () => {
  const t = useTranslations("Legal")
  const tD = useTranslations("DMCA")

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl min-h-[80vh]">
      <h1 className="text-4xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-4">
        {t("dmcaTitle")}
      </h1>
      
      <div className="space-y-8 text-white/70 leading-relaxed text-sm md:text-base">
        <section>
          <p className="text-lg text-white/90">
            {tD("p1")}
          </p>
        </section>

        <section className="bg-night-card p-6 rounded-xl border border-white/10">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">{tD("takedownTitle")}</h2>
          <p className="mb-4">
            {tD("takedownP1")}
          </p>
          <ul className="list-decimal pl-6 space-y-3">
            <li>{tD("takedownL1")}</li>
            <li>{tD("takedownL2")}</li>
            <li>{tD("takedownL3")}</li>
            <li>{tD("takedownL4")}</li>
            <li>{tD("takedownL5")}</li>
            <li>{tD("takedownL6")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-purple-400 mb-3">{tD("contactTitle")}</h2>
          <p>
            {tD("contactP1")}
          </p>
          <div className="bg-purple-900/20 p-4 mt-4 border border-purple-500/30 rounded-lg inline-block">
            <p className="font-bold text-white">Email: <a href="mailto:legal@aiuiso.site" className="text-cyan-400 hover:underline">legal@aiuiso.site</a></p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-purple-400 mb-3">{tD("counterTitle")}</h2>
          <p>
            {tD("counterP1")}
          </p>
        </section>

        <div className="mt-8 pt-8 border-t border-white/10 text-sm">
          <p className="font-medium text-red-400">
            {tD("note")}
          </p>
        </div>
      </div>
    </main>
  )
}

export default DMCAPage;
