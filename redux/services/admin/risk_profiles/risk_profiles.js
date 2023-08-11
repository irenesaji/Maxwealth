import {
  ADMIN_RISK_PROFILES,
  ADMIN_RISK_PROFILES_QUESTIONS,
  ADMIN_RISK_ANSWER_WEIGHTAGE,
  ADMIN_RISK_ANSWER_CHOICES,
} from "@/util/endpoints";
import getConfig from "next/config";
import axios from "axios";
import { getToken } from "@/util/common";
const { publicRuntimeConfig } = getConfig();
const BASE_URL = publicRuntimeConfig.BASE_URL;

export const getRiskProfiles = async (page, perPage) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(`${BASE_URL}${ADMIN_RISK_PROFILES}`, {
      headers: headers,
      params: {
        fields:
          "id,name,description,low,high,is_active,display_equity_allocation,min_equity_allocation,max_equity_allocation,display_debt_allocation,min_debt_allocation,max_debt_allocation,display_liquid_allocation,min_liquid_allocation,max_liquid_allocation,model_portfolio_id,created_at,updated_at",
        limit: perPage,
        page: page,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const createRiskProfile = async (data) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      `${BASE_URL}${ADMIN_RISK_PROFILES}`,
      data,
      { headers: headers }
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const updateRiskProfile = async (data, id) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };
    const response = await axios.patch(
      `${BASE_URL}${ADMIN_RISK_PROFILES}/${id}`,
      data,
      { headers: headers }
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const deleteRiskProfile = async (id) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };
    const response = await axios.delete(
      `${BASE_URL}${ADMIN_RISK_PROFILES}/${id}`,
      { headers: headers }
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getRiskProfileQuestions = async (page, perPage) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(
      `${BASE_URL}${ADMIN_RISK_PROFILES_QUESTIONS}`,
      {
        headers: headers,
        params: {
          fields: "id,description,question,is_active,created_at,updated_at",
          limit: perPage,
          page: page,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const createRiskProfileQuestion = async (data) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      `${BASE_URL}${ADMIN_RISK_PROFILES_QUESTIONS}`,
      data,
      { headers: headers }
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const updateRiskProfileQuestion = async (data, id) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };
    const response = await axios.patch(
      `${BASE_URL}${ADMIN_RISK_PROFILES_QUESTIONS}/${id}`,
      data,
      { headers: headers }
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const deleteRiskProfileQuestion = async (id) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };
    const response = await axios.delete(
      `${BASE_URL}${ADMIN_RISK_PROFILES_QUESTIONS}/${id}`,
      { headers: headers }
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getRiskProfileAnswerWeightage = async (page, perPage) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(
      `${BASE_URL}${ADMIN_RISK_ANSWER_WEIGHTAGE}`,
      {
        headers: headers,
        params: {
          fields: "id,weightage,created_at,updated_at",
          limit: perPage,
          page: page,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const createRiskAnswerWeightage = async (data) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      `${BASE_URL}${ADMIN_RISK_ANSWER_WEIGHTAGE}`,
      data,
      { headers: headers }
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const updateRiskAnswerWeightage = async (data, id) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };
    const response = await axios.patch(
      `${BASE_URL}${ADMIN_RISK_ANSWER_WEIGHTAGE}/${id}`,
      data,
      { headers: headers }
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const deleteRiskAnswerWeightage = async (id) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };
    const response = await axios.delete(
      `${BASE_URL}${ADMIN_RISK_ANSWER_WEIGHTAGE}/${id}`,
      { headers: headers }
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getRiskProfileAnswerChoices = async (page, perPage, id) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(
      `${BASE_URL}${ADMIN_RISK_ANSWER_CHOICES}`,
      {
        headers: headers,
        params: {
          fields:
            "id,answer,answer_image_url,position,created_at,updated_at,risk_profile_question_id,risk_answer_weightage_id",
          limit: perPage,
          page: page,
          filter: `risk_profile_question_id||$eq||${id}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const createRiskAnswerChoices = async (data) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      `${BASE_URL}${ADMIN_RISK_ANSWER_CHOICES}`,
      data,
      { headers: headers }
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const updateRiskAnswerChoices = async (data, id) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };
    const response = await axios.patch(
      `${BASE_URL}${ADMIN_RISK_ANSWER_CHOICES}/${id}`,
      data,
      { headers: headers }
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const deleteRiskProfileAnswerChoice = async (id) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };
    const response = await axios.delete(
      `${BASE_URL}${ADMIN_RISK_ANSWER_CHOICES}/${id}`,
      { headers: headers }
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};
