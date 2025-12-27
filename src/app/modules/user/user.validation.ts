import z from "zod";

export const UserRole = z.enum(["SUPER_ADMIN", "ADMIN", "HOST", "USER"]);

export const Gender = z.enum(["MALE", "FEMALE"]);

export const UserStatus = z.enum(["ACTIVE", "BLOCKED", "SUSPENDED"]);

export const becomeHostZodSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  contactNumber: z
    .string()
    .min(6, "Contact number is too short")
    .max(20, "Contact number is too long"),
  dateOfBirth: z.string().nonempty("Date of birth is required"),
  gender: Gender,

  // Host details
  organization: z.string().max(150, "Organization name is too long"),

  experienceLevel: z
    .number()
    .int("Experience level must be an integer")
    .min(0, "Experience level cannot be negative"),

  bio: z.string().max(500, "Bio cannot exceed 500 characters"),
  address: z.string().max(200, "Address is too long"),
});

export const createAdminZodSchema = z.object({
  email: z.string().email("Invalid email address"),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username is too long"),

  gender: Gender,

  contactNumber: z
    .string()
    .min(6, "Contact number is too short")
    .max(20, "Contact number is too long"),
  dateOfBirth: z.string().nonempty("Date of birth is required"),

  bio: z.string().max(500, "Bio cannot exceed 500 characters"),
  address: z.string().max(200, "Address is too long"),
});

/* =======================
   Update User Schema
======================= */

export const updateUserZodSchema = z.object({
  user: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long")
      .optional(),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .optional(),

    dateOfBirth: z.string().datetime().optional(),

    contactNumber: z
      .string()
      .min(6, "Contact number is too short")
      .max(20, "Contact number is too long")
      .optional(),

    profileImage: z
      .string()
      .url("Profile image must be a valid URL")
      .optional(),

    gender: Gender.optional(),

    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),

    interests: z.array(z.string()).optional(),

    location: z.string().max(100, "Location is too long").optional(),

    isProfilePublic: z.boolean().optional(),
  }),
});

export const updateAdminZodSchema = z.object({
  admin: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long")
      .optional(),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username is too long")
      .optional(),

    profilePhoto: z
      .string()
      .url("Profile photo must be a valid URL")
      .optional(),
    gender: Gender.optional(),

    contactNumber: z
      .string()
      .min(6, "Contact number is too short")
      .max(20, "Contact number is too long")
      .optional(),

    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  }),
});

export const updateHostZodSchema = z.object({
  host: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long")
      .optional(),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username is too long")
      .optional(),

    profilePhoto: z
      .string()
      .url("Profile photo must be a valid URL")
      .optional(),
    gender: Gender.optional(),
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
