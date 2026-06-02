import { GoogleLoginButton } from "@/components/features/auth/google-login-button"
import { Video } from "lucide-react"
import Link from "next/link"
import { CredentialsLoginForm } from "@/components/features/auth/credentials-login-form"
import { useTranslations } from "next-intl"

const LoginPage = () => {
  const t = useTranslations("Login")
  const tLegal = useTranslations("Legal")

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-night-card border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(124,58,237,0.1)] relative overflow-hidden">
        {/* Dekorasi efek cahaya */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-purple-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-cyan-500/20 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <Link href="/" className="mb-8 p-3 bg-white/5 rounded-2xl border border-white/10 shadow-lg">
            <Video className="w-10 h-10 text-purple-400" />
          </Link>
          
          <h1 className="text-3xl font-serif font-bold text-white mb-2 text-center">{t("welcome")}</h1>
          <p className="text-white/60 mb-6 text-center text-sm">
            {t("description")}
          </p>
          
          <div className="w-full mb-6">
            <CredentialsLoginForm />
          </div>

          <div className="w-full flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="text-xs text-white/40 font-medium">{t("or")}</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>
          
          <div className="w-full mb-6">
            <GoogleLoginButton />
          </div>
          
          <div className="mt-2 text-center text-sm text-white/40">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-purple-400 hover:underline font-medium">{t("registerNow")}</Link>
          </div>
          
          <p className="text-xs text-white/40 text-center mt-6">
            {t("agreeTerms")}{" "}
            <Link href="/terms" className="text-purple-400 hover:underline">{tLegal("tosTitle")}</Link>{" "}
            {t("and")}{" "}
            <Link href="/privacy" className="text-purple-400 hover:underline">{t("ourPrivacy")}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}


export default LoginPage;
