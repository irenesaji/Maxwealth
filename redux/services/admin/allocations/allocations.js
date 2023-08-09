import { ADMIN_MODEL_PORTFOLIOS } from "@/util/endpoints";
import getConfig from "next/config";
import axios from "axios";
const { publicRuntimeConfig } = getConfig();
const BASE_URL = publicRuntimeConfig.BASE_URL;

export const getAllocations = async (page, perPage) => {
  try {
    // const headers = {
    //   // Authorization: `Bearer ${getToken()}`,
    //   "Content-Type": "application/json",
    // };

    const response = await axios.get(`${BASE_URL}${ADMIN_MODEL_PORTFOLIOS}`, {
      // headers: headers,
      params: {
        fields: "id,name,description",
        limit: perPage,
        page: page,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getSearchResults = async (value, page, perPage) => {
  try {
    // const headers = {
    //   // Authorization: `Bearer ${getToken()}`,
    //   "Content-Type": "application/json",
    // };

    const response = await axios.get(`${BASE_URL}${ADMIN_MODEL_PORTFOLIOS}`, {
      // headers: headers,
      params: {
        fields: "id,name,description",
        limit: perPage,
        page: page,
        s: `{"$or":[{"full_name": {"$contL": "${value}"} }, {"email": {"$contL": "${value}"} } , {"mobile": {"$contL": "${value}"} } ]  }`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const createAllocation = async (data) => {
  try {
    // const headers = {
    //   // Authorization: `Bearer ${getToken()}`,
    //   "Content-Type": "application/json",
    // };

    const response = await axios.post(
      `${BASE_URL}${ADMIN_MODEL_PORTFOLIOS}`,
      data
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};
