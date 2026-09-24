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

export const createJob = AsyncHandler(async (req, res) => {});

export const getMyJobs = AsyncHandler(async (req, res) => {});

export const detailedJobById = AsyncHandler(async (req, res) => {});

export const updateJob = AsyncHandler(async (req, res) => {});

export const deleteJob = AsyncHandler(async (req, res) => {});

export const pauseJob = AsyncHandler(async (req, res) => {});

export const resumeJob = AsyncHandler(async (req, res) => {});
