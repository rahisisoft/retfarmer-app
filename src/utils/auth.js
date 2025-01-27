import Cookies from "js-cookie";

export const setToken = (token) => {
  Cookies.set("jwt", token, { expires: 7 }); // Store token for 7 days
};

export const getToken = () => Cookies.get("jwt");

export const removeToken = () => {
  Cookies.remove("jwt");
};
