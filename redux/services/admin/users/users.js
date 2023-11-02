import { ADMIN_USERS, ADMIN_USERS_ONBOARDING } from "@/util/endpoints";
import getConfig from "next/config";
import axios from "axios";
import { getToken } from "@/util/common";
const { publicRuntimeConfig } = getConfig();
const BASE_URL = publicRuntimeConfig.BASE_URL;

export const getUsers = async (page, perPage) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(`${BASE_URL}${ADMIN_USERS}`, {
      headers: headers,
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
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(`${BASE_URL}${ADMIN_USERS}`, {
      headers: headers,
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
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };
    console.log(data);

    const response = await axios.patch(
      `${BASE_URL}${ADMIN_USERS}/${id}`,
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

export const onBoarding = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(`${BASE_URL}${ADMIN_USERS_ONBOARDING}`, {
      headers: headers,
      params: {
        fields:
          "id,is_kyc_compliant,pan,full_name,date_of_birth,father_name,mother_name,marital_status,occupation,annual_income,nationality,signature_url,photo_url,video_url,fp_esign_status,kyc_id,fp_photo_file_id,fp_video_file_id,fp_signature_file_id,aadhaar_number,fp_esign_id,status,lat,lng,fp_investor_id,fp_investment_account_old_id,fp_investment_account_id,fp_kyc_status,fp_kyc_reject_reasons,user_id,created_at,updated_at",
      },
    });

    return response.data;
  } catch (error) {
    throw error.response;
  }
};
