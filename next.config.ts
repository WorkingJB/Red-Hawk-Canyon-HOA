import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Keep old Google Sites URLs working so existing bookmarks and links don't break.
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/bylaws", destination: "/documents", permanent: true },
      { source: "/hoa-faqs", destination: "/faq", permanent: true },
      { source: "/board-members", destination: "/board", permanent: true },
      { source: "/view/redhawkcanyonhoa/home", destination: "/", permanent: true },
      { source: "/view/redhawkcanyonhoa/bylaws", destination: "/documents", permanent: true },
      { source: "/view/redhawkcanyonhoa/hoa-faqs", destination: "/faq", permanent: true },
      { source: "/view/redhawkcanyonhoa/board-members", destination: "/board", permanent: true },
      { source: "/view/redhawkcanyonhoa/:page(irrigation|spraying)", destination: "/:page", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
