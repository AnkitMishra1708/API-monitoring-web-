import { ApiError } from "../../utils/index.js";

export const createJobService = async () => {
  try {
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while creating job.",
      error.message
    );
  }
};

export const getMyJobsService = async () => {
  try {
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while creating job.",
      error.message
    );
  }
};

export const detailedJobByIdService = async () => {
  try {
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while fetching job by id.",
      error.message
    );
  }
};

export const updateJobService = async () => {
  try {
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while updating job.",
      error.message
    );
  }
};

export const deleteJobService = async () => {
  try {
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while deleting job.",
      error.message
    );
  }
};

export const pauseJobService = async () => {
  try {
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while pausing job.",
      error.message
    );
  }
};

export const resumeJobService = async () => {
  try {
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while resuming job.",
      error.message
    );
  }
};
