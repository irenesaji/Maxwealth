import { ADMIN_GOALS } from "@/util/endpoints";
import getConfig from "next/config";
import axios from "axios";
import { getToken } from "@/util/common";
const { publicRuntimeConfig } = getConfig();
const BASE_URL = publicRuntimeConfig.BASE_URL;

export const getGoals = async (page, perPage) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(`${BASE_URL}${ADMIN_GOALS}`, {
      headers: headers,
      params: {
        fields: "id,name,description,icon,model_portfolio_id",
        limit: perPage,
        page: page,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const updateGoal = async (data, id) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };
    const response = await axios.patch(
      `${BASE_URL}${ADMIN_GOALS}/${id}`,
      data,
      { headers: headers }
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};
