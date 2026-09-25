import { AsyncHandler, ApiResponse } from "../../utils/index.js";
import {
  createExecutionService,
  getJobExecutionService,
} from "./execution.service.js";

export const createExecution = AsyncHandler(async (req, res) => {
  const { attempts } = req.body;
  const { jobId } = req.params;

  const execution = await createExecutionService(jobId, attempts);

  return res.json(
    new ApiResponse(201, execution, "Execution created successfully.")
  );
});

export const getJobExecution = AsyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const execution = await getJobExecutionService(jobId);

  return res.json(
    new ApiResponse(201, execution, "Execution fetched successfully.")
  );
});
