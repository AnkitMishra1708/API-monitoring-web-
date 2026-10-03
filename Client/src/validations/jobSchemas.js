import { z } from "zod";

export const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
export const INTERVALS = [
  { value: 5, label: "Every 5 seconds" },
  { value: 30, label: "Every 30 seconds" },
  { value: 60, label: "Every minute" },
  { value: 300, label: "Every 5 minutes" },
  { value: 600, label: "Every 10 minutes" },
  { value: 1800, label: "Every 30 minutes" },
];
export const intervalLabel = (v) =>
  INTERVALS.find((i) => i.value === v)?.label ?? `${v}s`;

const validJson = (v) => {
  if (!v.trim()) return true;
  try {
    JSON.parse(v);
    return true;
  } catch {
    return false;
  }
};

export const jobFormSchema = z.object({
  jobName: z
    .string()
    .trim()
    .min(3, "Job name must be at least 3 characters")
    .max(30, "Job name must not exceed 30 characters"),
  url: z
    .url("Enter a valid URL")
    .refine(
      (v) => /^https?:\/\//i.test(v),
      "URL must start with http:// or https://"
    ),
  method: z.enum(METHODS),
  monitorInterval: z
    .number("Choose an interval")
    .refine((v) => INTERVALS.some((i) => i.value === v), "Choose an interval"),
  headers: z.array(z.object({ key: z.string(), value: z.string() })),
  body: z.string().refine(validJson, "Body must be valid JSON"),
});

export const emptyForm = {
  jobName: "",
  url: "",
  method: "GET",
  monitorInterval: 300,
  headers: [],
  body: "",
};

export const toPayload = (v) => ({
  jobName: v.jobName,
  url: v.url,
  method: v.method,
  monitorInterval: v.monitorInterval,
  headers: Object.fromEntries(
    v.headers.filter((h) => h.key.trim()).map((h) => [h.key.trim(), h.value])
  ),
  body: v.method === "GET" || !v.body.trim() ? null : JSON.parse(v.body),
});

export const fromJob = (job) => ({
  jobName: job.jobName ?? "",
  url: job.url ?? "",
  method: job.method ?? "GET",
  monitorInterval: job.monitorInterval ?? 300,
  headers: Object.entries(job.headers ?? {}).map(([key, value]) => ({
    key,
    value,
  })),
  body: job.body ? JSON.stringify(job.body, null, 2) : "",
});
