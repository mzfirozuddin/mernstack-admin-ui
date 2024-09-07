import axios from "axios";
import { useAuthStore } from "../store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//: To avoid circular dependency
// const refreshToken = () => api.post("/auth/refresh");  //! This will create a proble, we have to create a new instance
const refreshToken = async () => {
  await axios.post(
    `${import.meta.env.VITE_BACKEND_API_URL}/auth/refresh`,
    {},
    {
      withCredentials: true,
    }
  );
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config; //: Store the previous request, so that we can re-try this request again

    if (error.response.status === 401 && !originalRequest._isRetry) {
      try {
        originalRequest._isRetry = true; //: To avoid infinite loop request
        const headers = { ...originalRequest.headers };
        await refreshToken(); // Token refresh
        return api.request({ ...originalRequest, headers });
      } catch (err) {
        console.error("Token refresh error: ", err);
        useAuthStore.getState().logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
