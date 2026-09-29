import { apiQueue } from "../queues/api.queue.js";

export const scheduleNextExecution = async (
  jobId,
  jobName,
  monitorInterval,
) => {
  const scheduleId = `${jobName}-${jobId}`;
  await apiQueue.add(
    scheduleId,
    {
      jobId,
    },
    {
      delay: monitorInterval * 1000,

      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 10000,
      },
      removeOnComplete: true,
    },
  );
};
