import axios from "axios";
import {
  KEY_ACCESS_TOKEN,
  getItem,
  removeItem,
  setItem,
} from "./localStorageManager";

let baseURL = 'http://localhost:4000/';
if(process.env.NODE_ENV === 'production'){
  baseURL = process.env.REACT_APP_SERVER_BASE_URL
}

export const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {
  const access_token = getItem(KEY_ACCESS_TOKEN);
  request.headers["Authorization"] = `Bearer ${access_token}`;
  return request;
});

axiosClient.interceptors.response.use(
  async (response) => {
    const data = response.data;
    if (data.status === "ok") {
      return data;
    }

    const originalRequest = response.config;
    const statusCode = data.statusCode;
    const error = data.message;

    if (statusCode === 401 && !originalRequest._retry) {
      // means accessToken is expired
      originalRequest._retry = true;
      const response = await axios
        .create({ withCredentials: true })
        .get(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`);

      if (response.data.status === "ok") {
        setItem(KEY_ACCESS_TOKEN, response.data.result.accessToken);
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.result.accessToken}`;

        return axios(originalRequest);
      } else {
        removeItem(KEY_ACCESS_TOKEN);
        window.location.replace("/login", "_self");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
  async (error) => {
    return Promise.reject(error);
  }
);
