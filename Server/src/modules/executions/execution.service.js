import { ApiError } from "../../utils/index.js";
import { Execution } from "./execution.model.js";

export const createExecutionService = async (jobId, attempts) => {
  try {
    const execution = await Execution.create({
      jobId,
      status: attempts[0].statusCode < 400 ? "Success" : "Failed",
      attempts: attempts,
    });

    return execution;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while creating execution.",
      error.message
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
      error.message
    );
  }
};
