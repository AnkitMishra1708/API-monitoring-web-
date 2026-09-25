import express from "express";
import { verifyJwt } from "../../middlewares/index.js";
import { createExecution, getJobExecution } from "./execution.controller.js";

const executionRoute = express.Router();

executionRoute
  .route("/:jobId/createExecution")
  .post(verifyJwt, createExecution);
executionRoute.route("/:jobId/getJobExecution").get(verifyJwt, getJobExecution);

export { executionRoute };
