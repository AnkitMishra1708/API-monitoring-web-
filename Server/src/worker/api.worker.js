import { Worker } from "bullmq";
import { redis } from "../config/redis.js";

export const apiWorker = new Worker(
  "monitor-api",
  async (job) => {
    console.log("Url:", job.data);
  },
  {
    connection: redis,
  },
);
