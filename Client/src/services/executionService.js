import { api } from "../lib/api";

const BASE = "/executions";

export const executionService = {
  getByJob: (jobId) => api.get(`${BASE}/${jobId}/getJobExecution`).then((r) => r.data),
};