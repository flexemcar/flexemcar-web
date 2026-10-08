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

// Direcciones de la web antigua (WordPress en flexemcar.com.es) que Google
// tiene indexadas. Al pasar el dominio a esta web, llevan a la sección
// equivalente en vez de dar error 404. Permanentes (308) para conservar el SEO.
const stock = "/#stock-disponible";
const oldSiteRedirects = [
  { source: "/comprar", destination: stock },
  { source: "/listados", destination: stock },
  { source: "/ficha", destination: stock },
  { source: "/listing-preview", destination: stock },
  { source: "/listing-preview2", destination: stock },
  { source: "/listing-preview3", destination: stock },
  { source: "/listpreview222", destination: stock },
  { source: "/wdk-listing/:slug*", destination: stock },
  { source: "/vender", destination: "/#vende-tu-furgoneta" },
  { source: "/contacto", destination: "/#contacto" },
  { source: "/empresa", destination: "/#dia-a-dia" },
  { source: "/politica-privacidad", destination: "/privacidad" },
  { source: "/politica-de-cookies", destination: "/cookies" },
  { source: "/mas-informacion-sobre-las-cookies", destination: "/cookies" },
].map((r) => ({ ...r, permanent: true }));

const nextConfig: NextConfig = {
  async redirects() {
    return oldSiteRedirects;
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    // Las fotos de Supabase llegan con "Cache-Control: no-cache", asi que con
    // el valor por defecto (4 h) cada foto optimizada caducaba enseguida y se
    // volvia a transformar, gastando el cupo mensual de Vercel. Cada foto se
    // guarda con un nombre unico (uuid) y nunca se sobrescribe: 31 dias es seguro.
    minimumCacheTTL: 2678400,
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
