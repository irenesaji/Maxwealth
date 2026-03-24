import { setUser } from "../reducers/userReducer";
import { setUserId, setToken, clearAll, getToken } from "@/util/common";
import { SIGNIN, CURRENT_USER, GENERATE_OTP } from "@/util/endpoints";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

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
      }
    );
    return response;
  } catch (error) {
    throw error.response;
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
        { headers: headers }
      );
      setToken(response.data.access_token);
      setUserId(response.data.id);
      dispatch(setUser(response.data));
      return response;
    } catch (error) {
      throw error.response.data.error;
    }
  };
};

export const initiateLogout = (router) => {
  clearAll();
  router.push("/");
};
