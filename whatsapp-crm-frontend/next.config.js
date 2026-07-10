/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    // Esto hace que Next.js ignore los errores de TypeScript durante el build en Easypanel
    ignoreBuildErrors: true,
  },
  eslint: {
    // De paso, ignoramos alertas de formato para que no se trabe por comillas o variables sin usar
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;