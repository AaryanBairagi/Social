import { z } from "zod";

export const ObjectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId");

export const UsernameSchema = z
  .string()
  .trim()
  .min(3)
  .max(30)
  .regex(/^[a-zA-Z0-9_.]+$/);

export const PasswordSchema = z
  .string()
  .min(8)
  .max(100);

export const EmailSchema = z
  .string()
  .trim()
  .email();

export const NameSchema = z
  .string()
  .trim()
  .min(2)
  .max(50);

export const BioSchema = z
  .string()
  .trim()
  .max(300)
  .optional();

export const ImageSchema = z
  .string()
  .url()
  .optional();