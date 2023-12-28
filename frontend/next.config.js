const {cleanEnv, str, url} = require("envalid");

cleanEnv(process.env, {
  NEXT_PUBLIC_HASURA_WS_URL: str(),
  NEXT_PUBLIC_HASURA_HTTP_URL: str(),
  NEXT_PUBLIC_NEXTJS_URL: str(),
  NEXT_PUBLIC_ALFACMS_BASE_URL: str(),
  // NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: str(),
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  async rewrites() {
    return [
      {
        source: "/api/v1/proxy/:path*",
        destination: `${process.env.NEXT_PUBLIC_ALFACMS_BASE_URL}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'saharasell.com',
        port: ''
      },
    ],
  },
};

module.exports = nextConfig;
