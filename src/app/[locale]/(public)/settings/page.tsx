import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { UsernameForm } from "@/components/features/settings/username-form"
import { PasswordForm } from "@/components/features/settings/password-form"
import { Settings as SettingsIcon, User } from "lucide-react"

export const metadata = {
  title: "Pengaturan Akun - Aiuiso",
}

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <SettingsIcon className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold font-serif text-white">Pengaturan Akun</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <nav className="flex flex-col gap-2">
              <div className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                <User className="w-4 h-4" /> Profil & Akun
              </div>
            </nav>
          </div>

          <div className="md:col-span-2 space-y-8">
            <div className="bg-night-card border border-white/5 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Informasi Profil</h2>
              <div className="space-y-4 text-white/80">
                <div>
                  <span className="block text-sm text-white/50 mb-1">Email Terdaftar</span>
                  <div className="bg-black/50 px-4 py-2 rounded-lg border border-white/5 font-mono text-sm">
                    {user.email}
                  </div>
                </div>
                <div>
                  <span className="block text-sm text-white/50 mb-1">ID Pengguna (Sistem)</span>
                  <div className="bg-black/50 px-4 py-2 rounded-lg border border-white/5 font-mono text-xs text-white/40">
                    {user.id}
                  </div>
                </div>
              </div>
            </div>

            {user.password && (
              <PasswordForm changeCount={user.passwordChangeCount} />
            )}

            {!user.usernameChanged ? (
              <UsernameForm currentUsername={user.username} />
            ) : (
              <div className="glass-card rounded-2xl p-6 border-l-4 border-green-500/50">
                <h3 className="text-xl font-bold text-white mb-2">Username Anda</h3>
                <p className="text-white/60 mb-4">
                  Anda telah menetapkan username permanen Anda. Username tidak dapat diubah lagi.
                </p>
                <div className="bg-black/50 px-4 py-3 rounded-lg border border-white/10 font-mono text-xl font-bold text-cyan-400 neon-cyan w-max">
                  @{user.username}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
