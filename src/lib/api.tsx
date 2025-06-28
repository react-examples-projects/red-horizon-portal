import axios from "axios";
import { getToken, isValidToken, removeToken } from "./token";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
});

axiosInstance.interceptors.request.use((req) => {
  const allowedUrls = [
    "/auth/signup",
    "/auth/login",
    "/auth/reset-password",
    "/auth/recover-password",
  ];
  const resetPatterns = [/^\/reset\/[a-zA-Z0-9]+$/, /^\/resetAdmin\/[a-zA-Z0-9]+$/];
  const matchCurrentUrl = resetPatterns.some((pattern) => pattern.test(req.url));
  const isAllowedUrl = allowedUrls.includes(req.url) || matchCurrentUrl;

  if ((req.url === "/user" && !isValidToken()) || (!isAllowedUrl && !isValidToken())) {
    
    if (getToken()) removeToken();
    window.location.href = "/";
    return Promise.reject(new Error("Invalid session, please login again"));
  }

  if (isValidToken()) {
    req.headers.authorization = `Bearer ${getToken()}`;
  }

  return req;
});

axiosInstance.interceptors.response.use(
  (res) => {
    if (res.status >= 400 && res.status < 600) {
      return Promise.reject(res);
    }

    return res;
  },
  (err) => {
    if ((!err.response && err.response?.status === 401) || err.response?.status === 403) {
      // removeToken();
      return Promise.reject(err);
    }

    const { code, message, response } = err || {};
    const { data, config, status } = response || {};

    if (code === "ERR_NETWORK") {
      return Promise.reject(data?.data ?? message);
    }

    const isNotAuthorized = data?.statusCode === 401 || status === 401 || status === 403;
    const isUrlsNotValid = config?.url !== "/user" && config?.url !== "/auth/login";

    // if ((isNotAuthorized && isUrlsNotValid) || (status === 403 && config?.url === "/user")) {
    //   removeToken();
    // }

    return Promise.reject(data?.data ?? err);
  }
);

export const getUserSession = async () => {
  const response = await axiosInstance.get("/user");
  return response.data?.data;
};

export const login = async (auth) => {
  const res = await axiosInstance.post("/auth/login", auth);
  return res.data?.data;
};
