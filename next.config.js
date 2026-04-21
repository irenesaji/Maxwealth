/** @type {import('next').NextConfig} */
const resolveBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;

  if (process.env.REACT_APP_ENVIRONMENT === "development") {
    return "https://api.maxwealth.money";
  }

  if (process.env.REACT_APP_ENVIRONMENT === "staging") {
    return "https://api.maxwealth.money";
  }

  return "https://api.maxwealth.money";
};

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE_URL: resolveBaseUrl(),
  },
};

module.exports = nextConfig;
