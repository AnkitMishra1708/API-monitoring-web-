import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(3, "First name must be at least 3 characters long")
    .max(30, "First name must not exceed 30 characters"),

  lastName: z
    .string()
    .min(3, "Last name must be at least 3 characters long")
    .max(30, "Last name must not exceed 30 characters"),

  email: z.email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must not exceed 100 characters"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must not exceed 100 characters"),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must not exceed 100 characters"),

  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must not exceed 100 characters"),

  confirmPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must not exceed 100 characters"),
});
