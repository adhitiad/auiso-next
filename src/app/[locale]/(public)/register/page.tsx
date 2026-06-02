"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { z } from "zod"

const registerSchema = z
  .object({
    username: z.string().min(3, "Username minimal 3 karakter").max(20, "Username terlalu panjang"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  })

type FieldErrors = Partial<Record<"username" | "email" | "password" | "confirmPassword" | "root", string>>

const RegisterPage = () => {
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const payload = Object.fromEntries(formData)

    const result = registerSchema.safeParse(payload)
    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FieldErrors
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    startTransition(async () => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrors({ root: data.error || "Pendaftaran gagal" })
        return
      }
      // Auto sign in setelah register
      await signIn("credentials", {
        email: result.data.email,
        password: result.data.password,
        callbackUrl: "/",
      })
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-night-bg">
      <div className="w-full max-w-md bg-night-card border border-white/10 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Daftar Akun
          </h1>
          <p className="text-white/50 text-sm">Buat akun baru untuk mulai menikmati konten</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.root && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
              {errors.root}
            </div>
          )}

          {[
            { id: "username", label: "Username", type: "text", placeholder: "OtakuBoy99", autocomplete: "username" },
            { id: "email", label: "Email", type: "email", placeholder: "email@contoh.com", autocomplete: "email" },
            { id: "password", label: "Password", type: "password", placeholder: "••••••••", autocomplete: "new-password" },
            { id: "confirmPassword", label: "Konfirmasi Password", type: "password", placeholder: "••••••••", autocomplete: "new-password" },
          ].map(({ id, label, type, placeholder, autocomplete }) => (
            <div key={id} className="space-y-1.5">
              <label htmlFor={id} className="text-sm font-medium text-white/80">{label}</label>
              <input
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                autoComplete={autocomplete}
                className="w-full bg-night-bg border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-white/20"
              />
              {errors[id as keyof FieldErrors] && (
                <p className="text-xs text-red-400">{errors[id as keyof FieldErrors]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {isPending ? "Mendaftar..." : "Daftar Sekarang"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-white/40">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-purple-400 hover:underline font-medium">Masuk di sini</Link>
        </div>
      </div>
    </div>
  )
}


export default RegisterPage;
