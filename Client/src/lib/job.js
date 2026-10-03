export const jobId = (job) => job._id ?? job.id;
export const isPaused = (job) =>
  job.status === "Paused" || job.isActive === false || job.isPaused === true;
