import { Queue } from "bullmq";
import { redis } from "../config/redis.js";

export const apiQueue = new Queue("monitor-api", {
  connection: redis,
});
