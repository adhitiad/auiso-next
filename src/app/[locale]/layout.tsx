import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { AuthProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@/components/analytics/ga4";
import { FacebookPixel } from "@/components/analytics/fb-pixel";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://aiuiso.site"),
  title: {
    default: "Aiuiso - Bokep Indo Viral, Video Hot & Streaming Terbaru",
    template: "%s | Bokep Indo Viral - Aiuiso",
  },
  description: "Platform streaming video bokep indo viral, konten hot pemersatu bangsa, dan video dewasa terbaru tanpa VPN. Tonton dan download gratis kualitas HD di Aiuiso.",
  keywords: [
    "bokep", "bokep indo", "bokep viral", "video viral", "video hot", "pemersatu bangsa", 
    "bokep jepang", "bokep barat", "streaming bokep", "bokep terbaru", "video dewasa",
    "aiuiso", "bokep no vpn", "bokep hd"
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Aiuiso",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aiuiso",
  },
  alternates: { canonical: "https://aiuiso.site" },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <GoogleAnalytics />
        <FacebookPixel />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Aiuiso",
              "url": "https://aiuiso.site/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://aiuiso.site/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <AuthProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
            <Toaster />
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

