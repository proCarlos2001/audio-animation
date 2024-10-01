// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          "p5": false, // Ignorar p5 en el lado del servidor
        };
      }
      return config;
    },
  };
  
  module.exports = nextConfig;
  
