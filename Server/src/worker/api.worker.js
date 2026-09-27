import { Worker } from "bullmq";
import { redis } from "../config/redis.js";
import { Execution } from "../modules/executions/execution.model.js";
import { Job } from "../modules/jobs/job.model.js";

export const apiWorker = new Worker(
  "monitor-api",
  async (redisData) => {
    const job = await Job.findById(redisData.data);
    let startTime;
    let response;
    let endTime;
    let responseTime;

    try {
      startTime = performance.now();
      response = await fetch(job.url);
      endTime = performance.now();
      responseTime = endTime - startTime;
    } catch (error) {
      if (0 === redisData.attemptsMade) {
        await Execution.create({
          jobId: job._id,
          status: "Failed",
          attempts: [
            {
              attempt: redisData.attemptsMade + 1,
              statusCode: null,
              message: error.message,
              responseTime: null,
            },
          ],
        });
      } else {
        await Execution.updateOne(
          { jobId: job._id },
          {
            $set: {
              status: "Failed",
            },
            $push: {
              attempts: {
                attempt: redisData.attemptsMade + 1,
                statusCode: null,
                message: error.message,
                responseTime: null,
              },
            },
          },
        );
      }

      throw error;
    }

    if (0 === redisData.attemptsMade) {
      await Execution.create({
        jobId: job._id,``
        status: response?.status < 400 ? "Success" : "Failed",
        attempts: [
          {
            attempt: redisData.attemptsMade + 1,
            statusCode: response?.status,
            message: response?.statusText,
            responseTime: responseTime,
          },
        ],
      });
    } else {
      await Execution.updateOne(
        { jobId: job._id },
        {
          $set: {
            status: response?.status < 400 ? "Success" : "Failed",
          },
          $push: {
            attempts: {
              attempt: redisData.attemptsMade + 1,
              statusCode: response?.status,
              message: response?.statusText,
              responseTime: responseTime,
            },
          },
        },
      );
    }

    if ([500, 502, 503, 504].includes(response?.status)) {
      throw new Error("Response server error");
    }
  },
  {
    connection: redis,
  },
);
