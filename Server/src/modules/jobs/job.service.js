import { ApiError } from "../../utils/index.js";
import { Job } from "./job.model.js";

export const createJobService = async (userId, data) => {
  try {
    if (!userId) {
      throw new ApiError(400, "Unauthorized request.");
    }

    const createdJob = await Job.create({
      userId,
      ...data,
    });

    return { createdJob };
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while creating job.",
      error.message
    );
  }
};

export const getMyJobsService = async (userId) => {
  try {
    const job = await Job.find({ userId });

    return job;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while creating job.",
      error.message
    );
  }
};

export const detailedJobByIdService = async (id) => {
  try {
    const job = await Job.findById({ _id: id });

    return job;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while fetching job by id.",
      error.message
    );
  }
};

export const updateJobService = async (userId, jobId, data) => {
  try {
    const updatedJob = await Job.findOneAndUpdate(
      { _id: jobId, userId },
      { $set: data },
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedJob) {
      throw new ApiError(404, "Job updation failed.");
    }

    return updatedJob;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while updating job.",
      error.message
    );
  }
};

export const deleteJobService = async (jobId) => {
  try {
    const deletedJob = await Job.deleteOne({ _id: jobId });

    return deletedJob;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while deleting job.",
      error.message
    );
  }
};

export const pauseJobService = async (userId, jobId) => {
  try {
    const updatedJob = await Job.findOneAndUpdate(
      { _id: jobId, userId },
      { $set: { status: "Paused" } },
      { returnDocument: "after", runValidators: true }
    );

    return updatedJob;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while pausing job.",
      error.message
    );
  }
};

export const resumeJobService = async (userId, jobId) => {
  try {
    const updatedJob = await Job.findOneAndUpdate(
      { _id: jobId, userId },
      { $set: { status: "Active" } },
      { returnDocument: "after", runValidators: true }
    );

    return updatedJob;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while resuming job.",
      error.message
    );
  }
};
