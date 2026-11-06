import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const localeSegments = [
  "about",
  "attendees",
  "award",
  "consent",
  "contact",
  "expo",
  "guest-country",
  "media",
  "partners",
  "privacy",
  "program",
  "register",
  "speakers",
  "sponsors",
  "terms",
  "youth",
] as const;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async redirects() {
    return [
      { source: "/", destination: "/ru", permanent: false },
      ...localeSegments.flatMap((segment) => [
        {
          source: `/${segment}`,
          destination: `/ru/${segment}`,
          permanent: false,
        },
        {
          source: `/${segment}/:path*`,
          destination: `/ru/${segment}/:path*`,
          permanent: false,
        },
      ]),
    ];
  },
};

export default withNextIntl(nextConfig);
