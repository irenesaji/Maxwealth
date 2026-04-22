import { USERID, USERTOKEN } from "./constants";

export const getSubDomain = () => {
  if (typeof window === "undefined") return "";
  const hostname = window.location.hostname;
  const localHosts = ["localhost", "127.0.0.1", "::1"];

  if (localHosts.includes(hostname)) {
    return process.env.NEXT_PUBLIC_TENANT_ID || "";
  }

  // For Vercel deployments and other hosting platforms, use environment variable
  if (hostname.includes("vercel.app")) {
    return process.env.NEXT_PUBLIC_TENANT_ID || "maxwealth";
  }

  // For custom domains, extract subdomain
  const parts = hostname.split(".");
  return parts[0];
};

export const getToken = () => {
  return localStorage.getItem(USERTOKEN);
};

export const setToken = (token) => {
  localStorage.setItem(USERTOKEN, token);
};

export const getUserId = () => {
  return localStorage.getItem(USERID);
};

export const setUserId = (id) => {
  localStorage.setItem(USERID, id);
};

export const clearAll = () => {
  localStorage.clear();
};
