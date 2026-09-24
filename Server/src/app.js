import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

import { userRoute } from "./modules/users/user.route.js";
import { jobRoute } from "./modules/jobs/job.route.js";

app.use("/api/v1/users", userRoute);
app.use("/api/v1/jobs", jobRoute);

app.use(errorHandler);

export { app };
