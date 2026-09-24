import { z } from "zod";

export const createJobSchema = z.object({
  jobName: z
    .string()
    .min(3, "Job name must be at least 3 characters long")
    .max(30, "Job name must not exceed 30 characters"),

  url: z.url("Please provide a valid HTTP or HTTPS URL"),

  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]).default("GET"),

  monitorInterval: z
    .union([
      z.literal(5),
      z.literal(30),
      z.literal(60),
      z.literal(300),
      z.literal(600),
      z.literal(1800),
    ])
    .default(300),

  headers: z.record(z.string()).default({}),

  body: z.any().optional().default(null),
});

export const updateJobSchema = z
  .object({
    jobName: z
      .string()
      .min(3, "Job name must be at least 3 characters long")
      .max(30, "Job name must not exceed 30 characters"),

    url: z.url("Please provide a valid HTTP or HTTPS URL"),

    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),

    monitorInterval: z.union([
      z.literal(5),
      z.literal(30),
      z.literal(60),
      z.literal(300),
      z.literal(600),
      z.literal(1800),
    ]),

    headers: z.record(z.string()),

    body: z.any(),
  })
  .partial();
