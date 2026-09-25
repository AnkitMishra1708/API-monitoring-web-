import { AsyncHandler, ApiResponse } from "../../utils/index.js";
import {
  executeJobService,
  getJobExecutionService,
} from "./execution.service.js";

export const executeJob = AsyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const execution = await executeJobService(jobId);

  return res.json(new ApiResponse(201, execution, "Execution Done."));
});

export const getJobExecution = AsyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const execution = await getJobExecutionService(jobId);

  return res.json(
    new ApiResponse(201, execution, "Execution fetched successfully.")
  );
});
