import express from "express";
import { verifyJwt } from "../../middlewares/index.js";
import { executeJob, getJobExecution } from "./execution.controller.js";

const executionRoute = express.Router();

executionRoute.route("/:jobId/executeJob").get(verifyJwt, executeJob);
executionRoute.route("/:jobId/getJobExecution").get(verifyJwt, getJobExecution);

export { executionRoute };
