/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;

module.exports = {
  publicRuntimeConfig: {
    BASE_URL:
      process.env.REACT_APP_ENVIRONMENT === "development"
        ? "https://api.maxwealth.money"
        : process.env.REACT_APP_ENVIRONMENT === "staging"
        ? "https://api.maxwealth.money"
        : "",
  },
};
