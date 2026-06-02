import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "asset.player4me.ink",
      },
      {
        protocol: "https",
        hostname: "cdn.aiuiso.site",
      },
      {
        protocol: "https",
        hostname: "img.play-thumb.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://connect.facebook.net https://poweredby.jads.co https://*.jads.co https://*.juicyads.com https://cdn.ampproject.org https://*.adtrafficquality.google; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: http:; frame-src 'self' https://player4me.com https://*.4meplayer.com https://filemoon.sx https://dood.la https://*.jads.co https://*.juicyads.com http://*.juicyads.com https://*.doubleclick.net https://*.google.com https://*.adtrafficquality.google; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.jads.co https://*.juicyads.com https://*.google.com https://*.doubleclick.net https://*.adtrafficquality.google https://cdn.ampproject.org; font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com; media-src 'self';",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
