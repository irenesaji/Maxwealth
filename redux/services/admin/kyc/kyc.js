import {
  ADMIN_KYC_ONBOARDING,
  ADMIN_KYC_ADDRESS,
  ADMIN_KYC_BANK,
  ADMIN_KYC_NOMINEE,
  ADMIN_KYC_PROOFS,
} from "@/util/endpoints";
import getConfig from "next/config";
import axios from "axios";
import { getToken } from "@/util/common";
const { publicRuntimeConfig } = getConfig();
const BASE_URL = publicRuntimeConfig.BASE_URL;

export const getKYCOnboarding = async (user_id) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };
    const response = await axios.get(`${BASE_URL}${ADMIN_KYC_ONBOARDING}`, {
      headers: headers,
      params: {
        fields:
          "id,is_kyc_compliant,pan,full_name,date_of_birth,father_name,mother_name,marital_status,occupation,annual_income,nationality,signature_url,photo_url,video_url,fp_esign_status,kyc_id,fp_photo_file_id,fp_video_file_id,fp_signature_file_id,aadhaar_number,fp_esign_id,status,lat,lng,fp_investor_id,fp_investment_account_old_id,fp_investment_account_id,fp_kyc_status,fp_kyc_reject_reasons,user_id,created_at,updated_at",
        filter: `user_id||$eq||${user_id}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getKYCAddress = async (user_id) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(`${BASE_URL}${ADMIN_KYC_ADDRESS}`, {
      headers: headers,
      params: {
        fields:
          "id,pincode,line_1,line_2,line_3,city,state,user,created_at,updated_at,user_id",
        filter: `user_id||$eq||${user_id}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getKYCBank = async (user_id) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(`${BASE_URL}${ADMIN_KYC_BANK}`, {
      headers: headers,
      params: {
        fields:
          "id,fp_bank_id,account_holder_name,account_number,ifsc_code,proof,bank_name,is_penny_drop_success,is_penny_drop_attempted,is_primary,penny_drop_request_id,created_at,updated_at,user_id",
        filter: `user_id||$eq||${user_id}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getKYCNominee = async (user_id) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(`${BASE_URL}${ADMIN_KYC_NOMINEE}`, {
      headers: headers,
      params: {
        fields:
          "id,name,date_of_birth,relationship,allocation_percentage,guardian_name,guardian_relationship,created_at,updated_at,user_id",
        filter: `user_id||$eq||${user_id}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getKYCProofs = async (user_id) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(`${BASE_URL}${ADMIN_KYC_PROOFS}`, {
      headers: headers,
      params: {
        fields:
          "id,type,document_type,fp_front_document_url,fp_back_document_url,front_document_path,back_document_path,document_id_number,fp_front_side_file_id,fp_back_side_file_id,user_id,proof_issue_date,proof_expiry_date,created_at,updated_at",
        filter: `user_id||$eq||${user_id}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response;
  }
};
