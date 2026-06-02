import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { auth } from "@/lib/auth";
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
  icons: {
    icon: "/123.jpg",
    apple: "/123.jpg",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Aiuiso",
    images: [{ url: "/123.jpg", width: 1200, height: 630 }],
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
  const session = await auth();
  const user = session?.user as any;

  return (
    <html lang={locale}>
      <head>
        {/* Google Tag Manager & Ads Verification */}
        <meta name="google-adsense-account" content="ca-pub-4036254141069104" />
        <meta name="7searchppc" content="fd516ce9ad69024bde89f52c5a3e4b56" />
        <Script
          id="adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4036254141069104"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          id="amp-auto-ads-script"
          async
          // @ts-ignore - custom-element is needed for amp
          custom-element="amp-auto-ads"
          src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"
          strategy="afterInteractive"
        />
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-55XKP494');`,
          }}
        />
        <meta
          name="juicyads-site-verification"
          content="dba245fd31629191fb4bda28c6d0ae17"
        />
      </head>
      <body className={inter.className}>
        {/* amp-auto-ads (injected via HTML to bypass TypeScript JSX validation) */}
        <div 
          dangerouslySetInnerHTML={{
            __html: `<amp-auto-ads type="adsense" data-ad-client="ca-pub-4036254141069104"></amp-auto-ads>`
          }} 
        />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-55XKP494"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <GoogleAnalytics />
        <FacebookPixel />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Aiuiso",
              "url": process.env.NEXT_PUBLIC_APP_URL || "https://aiuiso.site",
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${process.env.NEXT_PUBLIC_APP_URL || "https://aiuiso.site"}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <AuthProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {/* JuicyAds v3.0 */}
            {user?.role !== "premium" && user?.role !== "admin" && (
              <div className="w-full flex justify-center py-4 bg-night-bg">
                <Script
                  id="jads-js"
                  type="text/javascript"
                  data-cfasync="false"
                  async
                  src="https://poweredby.jads.co/js/jads.js"
                  strategy="afterInteractive"
                />
                <ins id="1118947" data-width="728" data-height="102"></ins>
                <Script
                  id="jads-init"
                  type="text/javascript"
                  data-cfasync="false"
                  async
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: `(window.adsbyjuicy = window.adsbyjuicy || []).push({'adzone':1118947});`,
                  }}
                />
              </div>
            )}

            {/* JuicyAds Native Interstitals v1.0 */}
            {user?.role !== "premium" && user?.role !== "admin" && (
              <Script
                id="juicyads-native-ads"
                data-id="juicyads-native-ads"
                type="text/javascript"
                data-ad-zone="1118954"
                data-targets="a"
                src="https://js.juicyads.com/juicyads.native-ads.min.js"
                strategy="afterInteractive"
              />
            )}

            {/* Adsterra Ads */}
            {user?.role !== "premium" && user?.role !== "admin" && (
              <div className="w-full flex flex-col items-center justify-center py-4 space-y-4">
                {/* Adsterra Native Banner */}
                <Script
                  id="adsterra-native-js"
                  async
                  data-cfasync="false"
                  src="https://downconvenientmagnetic.com/94705cc2f74c8c37022a45bf42b54d42/invoke.js"
                  strategy="afterInteractive"
                />
                <div id="container-94705cc2f74c8c37022a45bf42b54d42"></div>
                
                {/* Adsterra Iframe 300x250 */}
                <Script
                  id="adsterra-atoptions"
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: `window.atOptions = {
                      'key' : '94cc205d61c5f20cb8d363e74c8302f6',
                      'format' : 'iframe',
                      'height' : 250,
                      'width' : 300,
                      'params' : {}
                    };`
                  }}
                />
                <Script
                  id="adsterra-invoke"
                  src="https://downconvenientmagnetic.com/94cc205d61c5f20cb8d363e74c8302f6/invoke.js"
                  strategy="afterInteractive"
                />

                {/* Adsterra Social Bar / Popunder */}
                <Script
                  id="adsterra-social-bar"
                  src="https://downconvenientmagnetic.com/0b/15/9f/0b159fa0e18b0075fd739cd5836c6092.js"
                  strategy="afterInteractive"
                />
              </div>
            )}

            {children}
            <Toaster />
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

