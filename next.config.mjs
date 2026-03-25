/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@google-cloud/bigquery'],
    outputFileTracingIncludes: {
      '/api/**': ['./lib/schema.sql'],
    },
  },
};

export default nextConfig;
