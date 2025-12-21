import z from "zod";

export const UserRole = z.enum(["SUPER_ADMIN", "ADMIN", "HOST", "USER"]);

export const Gender = z.enum(["MALE", "FEMALE"]);

export const UserStatus = z.enum(["ACTIVE", "BLOCKED", "SUSPENDED"]);

export const createUserSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  gender: Gender.optional(),
  user: z.object({
    email: z.string().email("Invalid email address"),
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .optional(),
  }),
});

export const createHostSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  gender: Gender.optional(),
  host: z.object({
    email: z.string().email("Invalid email address"),
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .optional(),
    contactNumber: z
      .string()
      .min(6, "Contact number is too short")
      .max(20, "Contact number is too long")
      .optional(),

    // Host details
    organization: z
      .string()
      .max(150, "Organization name is too long")
      .optional(),

    experienceLevel: z
      .number()
      .int("Experience level must be an integer")
      .min(0, "Experience level cannot be negative")
      .optional(),

    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  }),
});

export const createAdminSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  gender: Gender.optional(),
  admin: z.object({
    email: z.string().email("Invalid email address"),
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .optional(),
    contactNumber: z
      .string()
      .min(6, "Contact number is too short")
      .max(20, "Contact number is too long")
      .optional(),
    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  }),
});
