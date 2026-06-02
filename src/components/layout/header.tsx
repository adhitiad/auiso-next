"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ChevronDown, User, Sparkles, Bot, Menu, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchBar } from "@/components/features/search/search-bar";

const specialCategories = [
  { name: "BDSM", slug: "bdsm" },
  { name: "Threesome", slug: "threesome" },
  { name: "MILF", slug: "milf" },
  { name: "NTR", slug: "ntr" },
  { name: "Yuri", slug: "yuri" },
];

const languages = [
  { code: "id", name: "Indonesia" },
  { code: "en", name: "English" },
  { code: "th", name: "ไทย (Thai)" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "ja", name: "日本語 (Japanese)" },
  { code: "zh", name: "中文 (Chinese)" },
  { code: "my", name: "မြန်မာ (Myanmar)" },
  { code: "ru", name: "Русский (Russian)" },
  { code: "ko", name: "한국어 (Korean)" },
];

export const Header = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Header");

  const handleLanguageChange = (newLocale: string) => {
    // Basic implementation for manual URL locale replacement since middleware is not used
    // This assumes all routes are prefixed with /[locale]
    const currentPath = pathname || "/";
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath === currentPath ? `/${newLocale}${currentPath}` : newPath);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl shadow-lg shadow-purple-900/10 transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 group flex-shrink-0">
          <span className="font-serif text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:drop-shadow-[0_0_10px_rgba(192,132,252,0.8)] transition-all duration-300">
            Aiuiso
          </span>
        </Link>

        {/* Desktop Search */}
        <div className="flex-1 max-w-xl mx-auto hidden md:block px-4">
          <SearchBar />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href={`/${locale}`}
            className="text-white/70 hover:text-white transition-colors"
          >
            {t("home")}
          </Link>
          <Link
            href={`/${locale}/recommended`}
            className="text-white/70 hover:text-white transition-colors"
          >
            {t("forYou")}
          </Link>
          <Link
            href={`/${locale}/shorts`}
            className="text-white/70 hover:text-white transition-colors flex items-center gap-1 font-bold text-pink-400"
          >
            Shorts
          </Link>
          <Link
            href={`/${locale}/search`}
            className="text-white/70 hover:text-white transition-colors"
          >
            {t("explore")}
          </Link>
          <Link
            href={`/${locale}/search-ai`}
            className="text-cyan-400 hover:text-white flex items-center gap-1 font-bold"
          >
            <Sparkles className="w-4 h-4" /> {t("aiSearch")}
          </Link>
          <Link
            href={`/${locale}/chat`}
            className="text-purple-400 hover:text-white flex items-center gap-1 font-bold relative"
          >
            <Bot className="w-4 h-4" /> {t("aiChat")}
            <span className="absolute -top-3 -right-4 bg-red-500 text-white text-[9px] px-1 rounded-sm">
              18+
            </span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-white/70 hover:text-white hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] transition-all text-sm font-medium">
              {t("categories")} <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/80 backdrop-blur-xl border-white/10 text-white shadow-2xl shadow-purple-900/20">
              {specialCategories.map((cat) => (
                <DropdownMenuItem
                  key={cat.slug}
                  className="hover:bg-white/10 focus:bg-white/10 cursor-pointer p-0"
                >
                  <Link
                    href={`/${locale}/${cat.slug}`}
                    className="w-full px-2 py-1.5 block"
                  >
                    {cat.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Auth, Language & Mobile */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="md:hidden flex-1 min-w-0">
            <SearchBar />
          </div>
          <div className="flex items-center gap-2">
            
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-white/70 hover:text-white hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] transition-all text-sm font-medium mr-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline-block uppercase">{locale}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/80 backdrop-blur-xl border-white/10 text-white shadow-2xl shadow-purple-900/20">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    className="hover:bg-white/10 focus:bg-white/10 cursor-pointer text-sm"
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 text-white/70 hover:text-white text-sm px-2 py-1 rounded-md hover:bg-white/10 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline-block font-medium">
                    {(user as any).username || user.name}
                  </span>
                  {(user as any).role === "premium" && (
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[10px] font-bold px-1.5 py-0.5 rounded ml-1 shadow-[0_0_5px_rgba(234,179,8,0.5)]">
                      PRO
                    </span>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="bg-black/80 backdrop-blur-xl border-white/10 text-white shadow-2xl shadow-purple-900/20"
                  align="end"
                >
                  {(user as any).role === "admin" && (
                    <DropdownMenuItem className="hover:bg-white/10 cursor-pointer text-purple-400 p-0">
                      <Link href={`/${locale}/admin/dashboard`} className="w-full px-2 py-1.5 block">
                        {t("adminPanel")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="hover:bg-white/10 cursor-pointer p-0">
                    <Link
                      href={`/${locale}/bookmarks`}
                      className="w-full px-2 py-1.5 block"
                    >
                      {t("bookmarks")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/10 cursor-pointer p-0">
                    <Link
                      href={`/${locale}/settings`}
                      className="w-full px-2 py-1.5 block"
                    >
                      {t("settings")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/10 cursor-pointer p-0">
                    <Link
                      href={`/${locale}/advertise`}
                      className="w-full px-2 py-1.5 block"
                    >
                      {t("advertise")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-white/10 cursor-pointer text-rose-400"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href={`/${locale}/login`}
                  className="hidden sm:inline-flex text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors"
                >
                  {t("login")}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="hidden sm:inline-flex bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm px-4 py-1.5 rounded-md transition-all font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5"
                >
                  {t("register")}
                </Link>
              </>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger className="md:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors">
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-night-card border-white/10 text-white w-[250px]"
              >
                <SheetHeader>
                  <SheetTitle className="text-left font-serif text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  <Link
                    href={`/${locale}`}
                    className="text-white/70 hover:text-white transition-colors text-lg"
                  >
                    {t("home")}
                  </Link>
                  <Link
                    href={`/${locale}/recommended`}
                    className="text-white/70 hover:text-white transition-colors text-lg"
                  >
                    {t("forYou")}
                  </Link>
                  <Link
                    href={`/${locale}/shorts`}
                    className="text-pink-400 font-bold hover:text-white transition-colors text-lg"
                  >
                    Shorts
                  </Link>
                  <Link
                    href={`/${locale}/search`}
                    className="text-white/70 hover:text-white transition-colors text-lg"
                  >
                    {t("explore")}
                  </Link>
                  <Link
                    href={`/${locale}/search-ai`}
                    className="text-cyan-400 hover:text-white text-lg flex items-center gap-2 font-bold"
                  >
                    <Sparkles className="w-5 h-5" /> {t("aiSearch")}
                  </Link>
                  <Link
                    href={`/${locale}/chat`}
                    className="text-purple-400 hover:text-white text-lg flex items-center gap-2 font-bold"
                  >
                    <Bot className="w-5 h-5" /> {t("aiChat")}
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm">
                      18+
                    </span>
                  </Link>

                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-sm font-semibold text-white/40 mb-3">
                      {t("categories")}
                    </h4>
                    <div className="flex flex-col gap-3">
                      {specialCategories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/${locale}/${cat.slug}`}
                          className="text-white/70 hover:text-white transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {!user && (
                    <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                      <Link
                        href={`/${locale}/login`}
                        className="w-full text-center border border-white/10 hover:bg-white/10 text-white py-2 rounded-md transition-colors"
                      >
                        {t("login")}
                      </Link>
                      <Link
                        href={`/${locale}/register`}
                        className="w-full text-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition-colors font-medium"
                      >
                        {t("register")}
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
