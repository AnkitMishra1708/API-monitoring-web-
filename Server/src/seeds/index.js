import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Job } from "../modules/jobs/job.model.js";
import { Execution } from "../modules/executions/execution.model.js";

dotenv.config();

const deleteAllJobs = async () => {
  const result = await Job.deleteMany({});

  console.log(`Deleted ${result.deletedCount} jobs`);
};

const deleteAllExecutions = async () => {
  const result = await Execution.deleteMany({});

  console.log(`Deleted ${result.deletedCount} executions`);
};

const seed = async () => {
  try {
    await connectDB();

    const command = process.argv[2];

    switch (command) {
      case "jobs":
        await deleteAllJobs();
        break;

      case "executions":
        await deleteAllExecutions();
        break;

      case "all":
        await deleteAllExecutions();
        await deleteAllJobs();
        break;

      default:
        console.log(`
          Available commands:

          npm run seed:jobs
          npm run seed:executions
          npm run seed:all
        `);
    }
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();
