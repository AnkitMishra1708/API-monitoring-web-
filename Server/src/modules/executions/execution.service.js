import { ApiError } from "../../utils/index.js";
import { Execution } from "./execution.model.js";
import { Job } from "../jobs/job.model.js";
import { apiQueue } from "../../queue/api.queue.js";

export const executeJobService = async (jobId) => {
  try {
    const job = await Job.findById(jobId);

    if (!job) {
      throw new ApiError(400, "Job not found.");
    }

    await apiQueue.add("executeApi", job.url);
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
