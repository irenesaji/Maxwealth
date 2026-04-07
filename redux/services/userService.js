import { setUser } from "../reducers/userReducer";
import { setUserId, setToken, clearAll, getToken } from "@/util/common";
import { SIGNIN, CURRENT_USER, GENERATE_OTP } from "@/util/endpoints";
import axios from "axios";

const RAW_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL?.trim();
const BASE_URL = (RAW_BASE_URL || "http://localhost:3021").replace(/\/+$/, "");
const API_TIMEOUT_MS = 15000;

const resolveApiError = (error, fallbackMessage) => {
  if (error?.code === "ERR_NETWORK") {
    return `Unable to connect to backend (${BASE_URL}). Please ensure the backend is running and CORS is configured.`;
  }

  return (
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage
  );
};

export const getCurrentUser = (tenant) => {
  return async (dispatch) => {
    try {
      const headers = {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
        tenant_id: tenant,
      };
      const response = await axios.get(`${BASE_URL}${CURRENT_USER}`, {
        headers: headers,
        timeout: API_TIMEOUT_MS,
      });

      dispatch(setUser(response.data));
    } catch (error) {
      clearAll();
      location.href = "/";
    }
  };
};

export const generateOTPService = async (phone, tenant) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      tenant_id: tenant,
    };
    const response = await axios.post(
      `${BASE_URL}${GENERATE_OTP}`,
      {
        mobile: phone,
      },
      {
        headers: headers,
        timeout: API_TIMEOUT_MS,
      }
    );
    return response;
  } catch (error) {
    throw resolveApiError(error, "Failed to generate OTP");
  }
};

export const initiateSignIn = (values, tenant) => {
  const headers = {
    "Content-Type": "application/json",
    tenant_id: tenant,
  };
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `${BASE_URL}${SIGNIN}`,
        {
          mobile: values.phone,
          otp: values.otp,
        },
        {
          headers: headers,
          timeout: API_TIMEOUT_MS,
        }
      );
      setToken(response.data.access_token);
      setUserId(response.data.id);
      dispatch(setUser(response.data));
      return response;
    } catch (error) {
      throw resolveApiError(error, "Sign in failed");
    }
  };
};

export const initiateLogout = (router) => {
  clearAll();
  router.push("/");
};
