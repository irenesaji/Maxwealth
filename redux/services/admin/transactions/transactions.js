import {
  ADMIN_TRANSACTIONS,
  ADMIN_FOLIOS,
  ADMIN_REDEMPTION_PLANS,
  ADMIN_TRANSACTIONS_LIST,
  ADMIN_REDEMPTIONS_LIST,
  ADMIN_PURCHASE_PLANS,
  ADMIN_PURCHASE_LIST,
  ADMIN_PURCHASES,
} from "@/util/endpoints";
import axios from "axios";
import { getToken } from "@/util/common";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

export const getTransactionsList = async (page, perPage, tenant) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      tenant_id: tenant,
    };

    const response = await axios.post(
      `${BASE_URL}${ADMIN_TRANSACTIONS}?page=${page}&limit=${perPage}`,
      {
        partner: null,
        traded_on_from: null,
        traded_on_to: null,
        primary_investor_name: null,
        folio_number: null,
        pan_number: null,
        limit: perPage,
        page: page,
      },
      { headers: headers }
    );
    return response.data.data.data.rows;
  } catch (error) {
    throw error.response;
  }
};

export const getTransactions = async (
  selectedFolio,
  selectedTypes,
  selectedFromDate,
  selectedToDate,
  tenant
) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      tenant_id: tenant,
    };

    const response = await axios.get(`${BASE_URL}${ADMIN_TRANSACTIONS}`, {
      headers: headers,
      params: {
        folios: selectedFolio,
        types: selectedTypes,
        from: selectedFromDate,
        to: selectedToDate,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAllFolios = async (tenant) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      tenant_id: tenant,
    };

    const response = await axios.get(`${BASE_URL}${ADMIN_FOLIOS}`, {
      headers: headers,
    });

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAllRedemptionPlans = async (tenant) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      tenant_id: tenant,
    };

    const response = await axios.get(`${BASE_URL}${ADMIN_REDEMPTION_PLANS}`, {
      headers: headers,
    });

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getRedemptionsList = async (
  selectedPlans,
  selectedStatus,
  tenant
) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      tenant_id: tenant,
    };

    const response = await axios.post(
      `${BASE_URL}${ADMIN_REDEMPTIONS_LIST}`,
      {
        plans: selectedPlans,
        states: selectedStatus,
      },
      { headers: headers }
    );
    return response.data.data.data.rows;
  } catch (error) {
    throw error.response;
  }
};

export const getAllPurchasePlans = async (tenant) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      tenant_id: tenant,
    };

    const response = await axios.get(`${BASE_URL}${ADMIN_PURCHASE_PLANS}`, {
      headers: headers,
    });

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getPurchaseList = async (
  selectedPlans,
  selectedStatus,
  selectedPurchases,
  tenant
) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      tenant_id: tenant,
    };

    const response = await axios.post(
      `${BASE_URL}${ADMIN_PURCHASE_LIST}`,
      {
        plans: selectedPlans,
        states: selectedStatus,
        ids:selectedPurchases
      },
      { headers: headers }
    );
    return response.data.data.data.rows;
  } catch (error) {
    throw error.response;
  }
};

export const getPurchases = async (
  tenant
) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      tenant_id: tenant,
    };

    const response = await axios.get(
      `${BASE_URL}${ADMIN_PURCHASES}`,
      { headers: headers }
    );
    return response.data.data;
  } catch (error) {
    throw error.response;
  }
};
