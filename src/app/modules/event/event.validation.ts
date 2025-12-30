import { z } from "zod";

export const createEventZodSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),

  category: z.enum(["EVENT", "ACTIVITY"]),

  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),

  location: z.string().min(2, "Location is required"),
  isOnline: z.boolean().default(false),

  priceType: z.enum(["FREE", "PAID"]),
  price: z.number().min(0).optional(),

  capacity: z.number().int().min(1, "Capacity must be at least 1"),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters"),

  tags: z.array(z.string()).default([]),

});
