const { z } = require("zod");

/**
 * Shared email schema
 * - trims whitespace
 * - lowercases
 * - validates format
 * This is the SINGLE source of truth for email normalization.
 */
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email();

/**
 * Register (signup) schema
 * Used by POST /auth/register
 */
const registerSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  name: z
    .string()
    .trim()
    .min(1)
    .optional(),
});

/**
 * Login schema
 * Used by POST /auth/login
 */
const loginSchema = z.object({
  email: emailSchema,
  password: z.string(),
});

module.exports = {
  registerSchema,
  loginSchema,
};