import getConfig from "next/config";
import axios from "axios";
import {
  ADMIN_MODEL_PORTFOLIOS_FUNDS,
  ADMIN_MODEL_PORTFOLIOS_FUNDS_NEW,
} from "@/util/endpoints";
const { publicRuntimeConfig } = getConfig();
const BASE_URL = publicRuntimeConfig.BASE_URL;

export const getFunds = async (page, perPage, id) => {
  try {
    // const headers = {
    //   // Authorization: `Bearer ${getToken()}`,
    //   "Content-Type": "application/json",
    // };
    console.log("huuh");
    const response = await axios.get(
      `${BASE_URL}${ADMIN_MODEL_PORTFOLIOS_FUNDS}`,
      {
        // headers: headers,
        params: {
          fields:
            "id,model_portfolio_id,scheme_isin,scheme_name,scheme_logo,scheme_category,scheme_asset_class,allocation_percentage,priority",
          limit: perPage,
          page: page,
          filter: `model_portfolio_id||$eq||${id}`,
        },
      }
    );

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

    // const response = await axios.get(`${BASE_URL}${ADMIN_USERS}`, {
    //   // headers: headers,
    //   params: {
    //     fields:
    //       "id,email,full_name,country_code,mobile,mobile_verified,is_active,is_blocked",
    //     limit: perPage,
    //     page: page,
    //     s: `{"$or":[{"full_name": {"$contL": "${value}"} }, {"email": {"$contL": "${value}"} } , {"mobile": {"$contL": "${value}"} } ]  }`,
    //   },
    // });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const createFund = async (data) => {
  try {
    // const headers = {
    //   // Authorization: `Bearer ${getToken()}`,
    //   "Content-Type": "application/json",
    // };

    const response = await axios.post(
      `${BASE_URL}${ADMIN_MODEL_PORTFOLIOS_FUNDS_NEW}`,
      data
    );

    // return response.data;
  } catch (error) {
    throw error.response;
  }
};
