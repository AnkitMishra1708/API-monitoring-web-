import { api } from "../lib/api.js";

export const authService = {
  register: (data) => api.post("/users/register", data).then((r) => r.data),
  login: (data) => api.post("/users/login", data).then((r) => r.data),
  logout: () => api.post("/users/logout").then((r) => r.data),
  getCurrentUser: () => api.get("/users/getCurrentUser").then((r) => r.data),
  refreshAccessToken: () =>
    api.post("/users/refreshAcessToken").then((r) => r.data),
};
