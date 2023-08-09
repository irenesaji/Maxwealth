import { ADMIN_USERS } from "@/util/endpoints";
import getConfig from "next/config";
import axios from "axios";
const { publicRuntimeConfig } = getConfig();
const BASE_URL = publicRuntimeConfig.BASE_URL;

export const getUsers = async (page, perPage) => {
  try {
    // const headers = {
    //   // Authorization: `Bearer ${getToken()}`,
    //   "Content-Type": "application/json",
    // };

    const response = await axios.get(`${BASE_URL}${ADMIN_USERS}`, {
      // headers: headers,
      params: {
        fields:
          "id,email,full_name,country_code,mobile,mobile_verified,is_active,is_blocked",
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

    const response = await axios.get(`${BASE_URL}${ADMIN_USERS}`, {
      // headers: headers,
      params: {
        fields:
          "id,email,full_name,country_code,mobile,mobile_verified,is_active,is_blocked",
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

export const updateUser = async (id, data) => {
  try {
    // const headers = {
    //   // Authorization: `Bearer ${getToken()}`,
    //   "Content-Type": "application/json",
    // };
    console.log(data);

    const response = await axios.patch(`${BASE_URL}${ADMIN_USERS}/${id}`, data);

    return response.data;
  } catch (error) {
    throw error.response;
  }
};
