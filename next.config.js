/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["services2.arcgis.com", "lh3.googleusercontent.com"],
  },
  env: {
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  },
};

module.exports = nextConfig;
