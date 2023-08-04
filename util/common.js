import { USERID, USERTOKEN } from "./constants";

export const getToken = () => {
  return localStorage.getItem(USERTOKEN);
};

export const setToken = (token) => {
  localStorage.setItem(USERTOKEN, token);
};

export const getUserId = () => {
  return localStorage.getItem(USERID);
};

export const setUserId = (id) => {
  localStorage.setItem(USERID, id);
};

export const clearAll = () => {
  localStorage.clear();
};
