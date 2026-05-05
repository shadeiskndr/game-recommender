/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.rawg.io",
      },
    ],
  },
  async redirects() {
    return [
      // Redirect netlify.app and vercel.app domain to custom domain
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "ai-game-recommender.netlify.app",
          },
          {
            type: "host",
            value: "ai-game-recommender.vercel.app",
          },
        ],
        destination: "https://ai-game-recommender.shahathir.me/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
