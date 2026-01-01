import { z } from "zod";

export const PriceType = z.enum(["FREE", "PAID"]);

export const createEventZodSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),

  category: z.enum(["EVENT", "ACTIVITY"]),

  date: z.string().min(1, "Date is required"),
  registrationDeadline: z.string().min(1, "Registration deadline is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),

  location: z.string().min(2, "Location is required"),

  priceType: PriceType,
  price: z.coerce.number().int().min(0).optional(),

  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  tags: z.array(z.string()).default([]),

});

export const updateEventZodSchema = createEventZodSchema.partial().superRefine((data, ctx) => {
  // If user sets PAID, ensure price > 0 (optional but good)
  if (data.priceType === "PAID") {
    const p = typeof data.price === "number" ? data.price : undefined;
    if (!p || p <= 0) {
      ctx.addIssue({
        code: "custom",
        message: "Price must be greater than 0 for paid events.",
        path: ["price"],
      });
    }
  }

  // If FREE, force price = 0 (backend protection)
  if (data.priceType === "FREE" && data.price !== undefined && data.price !== 0) {
    ctx.addIssue({
      code: "custom",
      message: "Price must be 0 for free events.",
      path: ["price"],
    });
  }
});
