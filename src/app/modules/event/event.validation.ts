import { z } from "zod";

export const PriceType = z.enum(["FREE", "PAID"]);

export const createEventZodSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),

    date: z.string().min(1, "Date is required"),

    registrationStartDate: z
      .string()
      .min(1, "Registration start date is required"),

    registrationDeadline: z
      .string()
      .min(1, "Registration deadline is required"),

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
  })
  .refine(
    (data) =>
      new Date(data.registrationStartDate) <
      new Date(data.registrationDeadline),
    {
      path: ["registrationStartDate"],
      message:
        "Registration start date must be earlier than registration deadline",
    },
  );

export const updateEventZodSchema = createEventZodSchema
  .partial()
  .superRefine((data, ctx) => {
    // ✅ PAID => price must be > 0
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

    // ✅ FREE => price must be 0 (if provided)
    if (
      data.priceType === "FREE" &&
      data.price !== undefined &&
      data.price !== 0
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Price must be 0 for free events.",
        path: ["price"],
      });
    }

    // ✅ registrationStartDate < registrationDeadline (only if both provided)
    if (data.registrationStartDate && data.registrationDeadline) {
      const start = new Date(data.registrationStartDate);
      const deadline = new Date(data.registrationDeadline);

      if (!(start < deadline)) {
        ctx.addIssue({
          code: "custom",
          message:
            "Registration start date must be earlier than registration deadline",
          path: ["registrationStartDate"],
        });
      }
    }

    // ⭐ Optional (recommended): if user updates one, require the other too
    if (data.registrationStartDate && !data.registrationDeadline) {
      ctx.addIssue({
        code: "custom",
        message:
          "Registration deadline is required when start date is provided.",
        path: ["registrationDeadline"],
      });
    }

    if (!data.registrationStartDate && data.registrationDeadline) {
      ctx.addIssue({
        code: "custom",
        message:
          "Registration start date is required when deadline is provided.",
        path: ["registrationStartDate"],
      });
    }
  });
