import { ADMIN_TRANSACTIONS } from "@/util/endpoints";
import getConfig from "next/config";
import axios from "axios";
import { getToken } from "@/util/common";
const { publicRuntimeConfig } = getConfig();
const BASE_URL = publicRuntimeConfig.BASE_URL;

export const getTransactions = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      `${BASE_URL}${ADMIN_TRANSACTIONS}`,
      {
        partner: null,
        traded_on_from: null,
        traded_on_to: null,
        primary_investor_name: null,
        folio_number: null,
        pan_number: null,
      },
      { headers: headers }
    );
    return response.data.data.data.rows;
  } catch (error) {
    throw error.response;
  }
};
