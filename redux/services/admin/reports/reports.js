import {
  ADMIN_AUM_REPORT,
  ADMIN_CATEGORY_SUMMARY,
  ADMIN_REPORTS_ACCOUNT_WISE,
  ADMIN_REPORTS_CAPITAL_GAINS,
  ADMIN_REPORTS_HOLDINGS,
  ADMIN_REPORTS_SCHEME_WISE,
} from "@/util/endpoints";
import axios from "axios";
import { getToken } from "@/util/common";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";


export const getAumReport = async (tenant) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      tenant_id: tenant,
    };

    const response = await axios.post(
      `${BASE_URL}${ADMIN_AUM_REPORT}`,
      { partner: null, traded_on_from: null, traded_on_to: null },
      { headers: headers }
    );
    return response.data.data.data.rows;
  } catch (error) {
    throw error.response;
  }
};

export const getSummaryReport = async (tenant) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      tenant_id: tenant,
    };

    const response = await axios.post(
      `${BASE_URL}${ADMIN_CATEGORY_SUMMARY}`,
      { partner: null, traded_on_from: null, traded_on_to: null },
      { headers: headers }
    );
    return response.data.data.data.rows;
  } catch (error) {
    throw error.response;
  }
};

export const getHoldingReport = async (account_id, folios, as_on, tenant) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      tenant_id: tenant,
    };

    const response = await axios.get(`${BASE_URL}${ADMIN_REPORTS_HOLDINGS}`, {
      headers: headers,
      params: {
        investment_account_id: account_id,
        folios: folios,
        as_on: as_on,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getCapitalGainReport = async (
  account_id,

  traded_on_from,
  traded_on_to,
  tenant
) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      tenant_id: tenant,
    };

    const response = await axios.post(
      `${BASE_URL}${ADMIN_REPORTS_CAPITAL_GAINS}`,
      {
        mf_investment_account: account_id,
        scheme: null,
        traded_on_from: traded_on_from || null,
        traded_on_to: traded_on_to || null,
      },
      { headers: headers }
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getSchemeWiseReport = async (account_id, traded_on_to, tenant) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      tenant_id: tenant,
    };

    const response = await axios.post(
      `${BASE_URL}${ADMIN_REPORTS_SCHEME_WISE}`,
      {
        mf_investment_account: account_id,
        traded_on_to: traded_on_to || null,
      },
      {
        headers: headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAccountWiseReport = async (
  account_id,
  traded_on_to,
  tenant
) => {
  try {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      tenant_id: tenant,
    };

    const response = await axios.post(
      `${BASE_URL}${ADMIN_REPORTS_ACCOUNT_WISE}`,
      {
        mf_investment_account: account_id,
        traded_on_to: traded_on_to || null,
      },
      {
        headers: headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error.response;
  }
};
