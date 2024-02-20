import { ADMIN_MODEL_PORTFOLIOS } from "@/util/endpoints";
import getConfig from "next/config";
import axios from "axios";
import { getToken } from "@/util/common";
const { publicRuntimeConfig } = getConfig();
const BASE_URL = publicRuntimeConfig.BASE_URL;

export const getAllocations = async (page, perPage, tenant) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      tenant_id: tenant,
    };

    const response = await axios.get(`${BASE_URL}${ADMIN_MODEL_PORTFOLIOS}`, {
      headers: headers,
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

export const getSearchResults = async (value, page, perPage, tenant) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      tenant_id: tenant,
    };

    const response = await axios.get(`${BASE_URL}${ADMIN_MODEL_PORTFOLIOS}`, {
      headers: headers,
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

export const createAllocation = async (data, tenant) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      tenant_id: tenant,
    };

    const response = await axios.post(
      `${BASE_URL}${ADMIN_MODEL_PORTFOLIOS}`,
      data,
      { headers: headers }
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const updateAllocation = async (id, data, tenant) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      tenant_id: tenant,
    };
    console.log(data);

    const response = await axios.patch(
      `${BASE_URL}${ADMIN_MODEL_PORTFOLIOS}/${id}`,
      data,
      {
        headers: headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};
