import { apiQueue } from "../queues/api.queue.js";

export const scheduleNextExecution = async (jobId, monitorInterval) => {
  const scheduleId = `monitor-${jobId}`;
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

export const stopScheduler = async (jobId) => {
  const scheduleId = `monitor-${jobId}`;

  const job = await apiQueue.getJob(scheduleId);

  if (job) {
    await apiQueue.remove(scheduleId);
  }

  return;
};
