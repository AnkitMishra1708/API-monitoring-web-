import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER,
  withCredentials: true,
});

const SKIP_REFRESH = [
  "/users/login",
  "/users/register",
  "/users/refreshAcessToken",
];

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const skip = SKIP_REFRESH.some((path) => original?.url?.includes(path));

    if (status === 401 && original && !original._retry && !skip) {
      original._retry = true;
      try {
        refreshPromise ??= api
          .post("/users/refreshAcessToken")
          .finally(() => (refreshPromise = null));
        await refreshPromise;
        return api(original);
      } catch (refreshError) {
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(refreshError);
      }
    }

    error.message = error.response?.data?.message || error.message;
    return Promise.reject(error);
  },
);
