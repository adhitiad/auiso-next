"use client"

import Link from "next/link"
import { SearchBar } from "@/components/features/search/search-bar"
import { UserMenu } from "@/components/features/auth/user-menu"
import { GoogleLoginButton } from "@/components/features/auth/google-login-button"
import { useSession } from "next-auth/react"

export const Navbar = () => {
  const { data: session } = useSession()
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Aiuiso
        </Link>
        <div className="flex-1 max-w-xl mx-4 hidden sm:block">
          <SearchBar />
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <UserMenu />
          ) : (
            <div className="w-[180px]">
              <GoogleLoginButton />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
