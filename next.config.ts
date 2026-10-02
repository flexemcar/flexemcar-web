import type { NextConfig } from "next";

// Cabeceras de seguridad para todas las rutas. Sin CSP completa a proposito:
// el mapa, los reels y los videos cargan de terceros y una CSP estricta los romperia.
const securityHeaders = [
  // Nadie puede meter la web (ni el panel) dentro de un iframe ajeno: evita clickjacking.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Varias fotos por vehiculo suben en el mismo formulario del panel de admin.
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
