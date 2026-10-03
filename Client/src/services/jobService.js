import { api } from "../lib/api";

const BASE = "/jobs";
const unwrap = (r) => r.data;

export const jobService = {
  create: (data) => api.post(`${BASE}/createJob`, data).then(unwrap),
  getMyJobs: () => api.get(`${BASE}/getMyJobs`).then(unwrap),
  getById: (id) => api.get(`${BASE}/detailedJobById/${id}`).then(unwrap),
  update: (id, data) => api.patch(`${BASE}/${id}`, data).then(unwrap),
  remove: (id) => api.delete(`${BASE}/${id}`).then(unwrap),
  pause: (id) => api.patch(`${BASE}/${id}/pauseJob`).then(unwrap),
  activate: (id) => api.patch(`${BASE}/${id}/activeJob`).then(unwrap),
};
