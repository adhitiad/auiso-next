import { Metadata } from "next"
import Link from "next/link"
import { Mail, MapPin, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useTranslations } from "next-intl"

export const metadata = {
  title: "Kontak Kami - Aiuiso",
  description: "Hubungi tim Aiuiso untuk bantuan dan pertanyaan.",
}

const ContactPage = () => {
  const t = useTranslations("Legal")
  const tC = useTranslations("Contact")

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl min-h-[80vh]">
      <h1 className="text-4xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-4">
        {t("contactTitle")}
      </h1>
      <div className="text-center mb-12">
        <p className="text-white/50 text-lg max-w-2xl mx-auto">
          {tC("desc")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-night-card p-6 rounded-xl border border-white/10 flex items-start gap-4 hover:border-purple-500/30 transition-colors">
            <div className="bg-purple-500/20 p-3 rounded-full">
              <Mail className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{tC("supportTitle")}</h3>
              <p className="text-white/50 mb-2">{tC("supportDesc")}</p>
              <Link href="mailto:support@aiuiso.site" className="text-cyan-400 hover:underline font-medium">
                support@aiuiso.site
              </Link>
            </div>
          </div>

          <div className="bg-night-card p-6 rounded-xl border border-white/10 flex items-start gap-4 hover:border-red-500/30 transition-colors">
            <div className="bg-red-500/20 p-3 rounded-full">
              <MessageSquare className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Legal & DMCA</h3>
              <p className="text-white/50 mb-2">Legal & DMCA Inquiries.</p>
              <Link href="mailto:legal@aiuiso.site" className="text-cyan-400 hover:underline font-medium">
                legal@aiuiso.site
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-night-card p-8 rounded-xl border border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none" />
          
          <h2 className="text-2xl font-bold text-white mb-6">{tC("send")}</h2>
          <form className="space-y-5 relative z-10">
            <div className="space-y-2">
              <Label>{tC("name")}</Label>
              <Input required placeholder={tC("namePlaceholder")} className="bg-night-bg border-white/10" />
            </div>
            
            <div className="space-y-2">
              <Label>{tC("email")}</Label>
              <Input type="email" required placeholder={tC("emailPlaceholder")} className="bg-night-bg border-white/10" />
            </div>
            
            <div className="space-y-2">
              <Label>Kategori Pesan</Label>
              <select className="w-full h-10 px-3 rounded-md bg-night-bg border border-white/10 text-white focus:ring-2 focus:ring-purple-500 outline-none text-sm appearance-none cursor-pointer">
                <option value="general">{tC("supportTitle")}</option>
                <option value="billing">{tC("businessTitle")}</option>
                <option value="report">{tC("securityTitle")}</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>{tC("message")}</Label>
              <Textarea
                required
                rows={5}
                className="bg-night-bg border-white/10 resize-none min-h-[120px]"
                placeholder={tC("messagePlaceholder")}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 transition-colors"
            >
              {tC("send")}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}


export default ContactPage;
