import { ADMIN_AUM_REPORT, ADMIN_CATEGORY_SUMMARY } from "@/util/endpoints";
import getConfig from "next/config";
import axios from "axios";
import { getToken } from "@/util/common";
const { publicRuntimeConfig } = getConfig();
const BASE_URL = publicRuntimeConfig.BASE_URL;

export const getAumReport = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      `${BASE_URL}${ADMIN_AUM_REPORT}`,
      { partner: null, traded_on_from: null, traded_on_to: null },
      { headers: headers }
    );
    return response.data.data.data.rows;
  } catch (error) {
    throw error.response;
  }
};

export const getSummaryReport = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      `${BASE_URL}${ADMIN_CATEGORY_SUMMARY}`,
      { partner: null, traded_on_from: null, traded_on_to: null },
      { headers: headers }
    );
    return response.data.data.data.rows;
  } catch (error) {
    throw error.response;
  }
};
