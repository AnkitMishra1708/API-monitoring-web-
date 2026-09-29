import { ApiError } from "../../utils/index.js";
import { Execution } from "./execution.model.js";

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
