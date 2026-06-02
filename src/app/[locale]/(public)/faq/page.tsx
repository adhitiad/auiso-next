import { Metadata } from "next"
import Link from "next/link"
import { Shield, Globe, Lock, Rss } from "lucide-react"
import { useTranslations } from "next-intl"

export const metadata: Metadata = {
  title: "Pertanyaan Umum (FAQ) - Aiuiso",
  description: "Temukan jawaban untuk pertanyaan umum seputar Aiuiso.",
}



const FAQPage = () => {
  const t = useTranslations("Legal")
  const tF = useTranslations("FAQ")

  const FAQS = [
    {
      question: tF("q1"), answer: tF("a1"), icon: <Shield className="h-6 w-6 text-cyan-400" />,
    },
    {
      question: tF("q2"), answer: tF("a2"), icon: <Globe className="h-6 w-6 text-cyan-400" />,
    },
    {
      question: tF("q3"), answer: tF("a3"), icon: <Lock className="h-6 w-6 text-cyan-400" />,
    },
    {
      question: tF("q4"), answer: tF("a4"), icon: <Rss className="h-6 w-6 text-cyan-400" />,
    }
  ]

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl min-h-[80vh]">
      <h1 className="text-4xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-4">
        {t("faqTitle")}
      </h1>
      <div className="mb-12 text-center">
        <p className="text-white/50 text-lg max-w-2xl mx-auto">
          {tF("desc")}
        </p>
      </div>

      <div className="space-y-6">
        {FAQS.map((faq, idx) => (
          <div
            key={idx}
            className="bg-night-card border border-white/10 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-night-bg rounded-lg shrink-0 border border-white/5">
                {faq.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {faq.question}
                </h3>
                <p className="text-white/60 leading-relaxed text-sm md:text-base">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-br from-night-card to-night-bg border border-white/10 rounded-xl p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
        <h2 className="text-2xl font-bold mb-4 text-white relative z-10">
          Masih Butuh Bantuan?
        </h2>
        <p className="text-white/50 mb-6 relative z-10 max-w-lg mx-auto">
          Jika Anda tidak menemukan jawaban untuk pertanyaan Anda, jangan ragu untuk menghubungi tim dukungan kami.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-lg font-bold transition-colors bg-purple-600 text-white hover:bg-purple-700 py-3 px-8 relative z-10 shadow-lg shadow-purple-900/50"
        >
          Hubungi Dukungan
        </Link>
      </div>
    </main>
  )
}


export default FAQPage;
