import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },  // Permitir solicitudes desde cualquier origen
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },  // Métodos permitidos
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },  // Encabezados permitidos
        ],
      },
    ];
  },
};

export default nextConfig;
