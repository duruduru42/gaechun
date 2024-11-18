const { withNextVideo } = require('next-video/process')

/** @type {import('next').NextConfig} */
const nextConfig = { 
//     webpack: (config) => {
//     config.module.rules.push({
//       test: /\.svg$/i,
//       issuer: /\.[jt]sx?$/,
//       use: ["@svgr/webpack"],
//     });
//     return config;
//   },
};

module.exports = withNextVideo(nextConfig);
