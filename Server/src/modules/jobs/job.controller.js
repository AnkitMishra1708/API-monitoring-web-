import { AsyncHandler, ApiResponse } from "../../utils/index.js";
import {
  createJobService,
  getMyJobsService,
  detailedJobByIdService,
  updateJobService,
  deleteJobService,
  pauseJobService,
  resumeJobService,
} from "./job.service.js";

export const createJob = AsyncHandler(async (req, res) => {
  const { jobName, url, method, headers, body, monitorInterval } = req.body;
  const userId = req.user.id;

  const job = await createJobService(userId, {
    jobName,
    url,
    method,
    headers,
    body,
    monitorInterval,
  });

  return res.json(new ApiResponse(201, job, "Job created successfully."));
});

export const getMyJobs = AsyncHandler(async (req, res) => {
  const userId = req.user.id;

  const jobs = await getMyJobsService(userId);

  res.json(new ApiResponse(200, jobs, "All jobs fetched successfully."));
});

export const detailedJobById = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await detailedJobByIdService(id);

  return res.json(
    new ApiResponse(200, job, "Detailed job fetch successfully.")
  );
});

export const updateJob = AsyncHandler(async (req, res) => {
  const { jobName, url, method, headers, body, monitorInterval } = req.body;
  const userId = req.user.id;
  const { id } = req.params;

  const job = await updateJobService(userId, id, {
    jobName,
    url,
    method,
    headers,
    body,
    monitorInterval,
  });

  return res.json(new ApiResponse(200, job, "Job updated successfully."));
});

export const deleteJob = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await deleteJobService(id);

  return res.json(new ApiResponse(200, job, "Job deleted successfully."));
});

export const pauseJob = AsyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const job = await pauseJobService(userId, id);

  return res.json(new ApiResponse(200, job, "Job pause successfully."));
});

export const resumeJob = AsyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const job = await resumeJobService(userId, id);

  return res.json(new ApiResponse(200, job, "Job active successfully."));
});
