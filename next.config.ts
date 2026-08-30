import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
