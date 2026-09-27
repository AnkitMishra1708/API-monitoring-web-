import { ApiError } from "../../utils/index.js";
import { Execution } from "./execution.model.js";
import { Job } from "../jobs/job.model.js";
import { apiQueue } from "../../queue/api.queue.js";

export const executeJobService = async (jobId) => {
  try {
    await apiQueue.add("executeApi", jobId, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while creating execution.",
      error.message,
    );
  }
};

export const getJobExecutionService = async (jobId) => {
  try {
    const allExecution = await Execution.find({ jobId });

    return allExecution;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while fetching execution.",
      error.message,
    );
  }
};
