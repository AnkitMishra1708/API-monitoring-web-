import express from "express";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import {
  createJob,
  getMyJobs,
  detailedJobById,
  updateJob,
  deleteJob,
  pauseJob,
  resumeJob,
} from "./job.controller.js";

const jobRoute = express.Router();

jobRoute.route("/createJob").post(verifyJwt, createJob);
jobRoute.route("/getMyJobs").get(verifyJwt, getMyJobs);
jobRoute.route("/detailedJobById/:id").get(verifyJwt, detailedJobById);
jobRoute.route("/:id").patch(verifyJwt, updateJob);
jobRoute.route("/:id").delete(verifyJwt, deleteJob);
jobRoute.route("/:id/pauseJob").patch(verifyJwt, pauseJob);
jobRoute.route("/:id/resumeJob").patch(verifyJwt, resumeJob);

export { jobRoute };
