import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'github.com',
        },
        {
          protocol: 'https',
          hostname: 'avatars.githubusercontent.com', // GitHub redirects here, so add this too!
        },
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com', // Useful if you use Google Auth avatars later
        },
      ],
    },
};

export default nextConfig;
