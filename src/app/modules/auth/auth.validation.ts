import z from "zod";
import { Gender } from "../user/user.validation";

export const createUserZodSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  user: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .optional(),
    email: z.string().email("Invalid email address"),
  }),
});

export type CreateUserPayload = z.infer<typeof createUserZodSchema>;
