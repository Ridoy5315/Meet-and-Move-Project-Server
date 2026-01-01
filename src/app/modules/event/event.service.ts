import httpStatus from "http-status";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Event, EventStatus, PriceType, Prisma } from "@prisma/client";
import { fileUploader } from "../../config/fileUploaders";
import AppError from "../../errorHelpers/AppError";
import prisma from "../../shared/prisma";
import { IEventFilterRequest } from "./event.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../helpers/paginationHelper";
import { eventSearchableFields } from "./event.constants";

const createEvent = async (req: Request): Promise<Event> => {
  const decodedToken = req.user as JwtPayload;

  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const host = await prisma.host.findFirstOrThrow({
    where: {
      email: decodedToken.email,
      isDeleted: false,
    },
  });

  if (host.id !== req.params.id) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to submit host information for another account."
    );
  }

  const tags =
    (req.body.tags as string[] | undefined)?.map((t: string) =>
      t.toLowerCase()
    ) ?? [];

  const eventData = {
    title: req.body.title,
    description: req.body.description,
    date: new Date(req.body.date),
    registrationDeadline: new Date(req.body.registrationDeadline),
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    location: req.body.location,
    priceType: req.body.priceType,
    price: req.body.price ?? null,
    capacity: req.body.capacity,
    tags,
    imageUrl: req.body.profilePhoto,
    host: {
      connect: {
        id: req.params.id,
      },
    },
  };

  const createdEvent = await prisma.event.create({
    data: { ...eventData },
  });

  console.log("createdEvent", createdEvent);

  return createdEvent;
};

const getAllPublicEvents = async (
  filters: IEventFilterRequest,
  options: IPaginationOptions
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, date, priceType, minPrice, maxPrice, ...filterData } =
    filters;

    console.log("minPrice", minPrice, "maxPrice", maxPrice)

  const andConditions: Prisma.EventWhereInput[] = [];

  const normalizedSearch = (searchTerm ?? "").toLowerCase();

  if (searchTerm) {
    andConditions.push({
      OR: [
        ...eventSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        })),
        {
          tags: {
            has: normalizedSearch,
          },
        },
      ],
    });
  }

  if (date) {
    andConditions.push({
      date: {
        gte: new Date(date), // events on or after this date
      },
    });
  }

  if (priceType) {
    andConditions.push({
      priceType: {
        equals: priceType,
      },
    });
  }

  const minPriceNum = minPrice !== undefined ? Number(minPrice) : undefined;
  const maxPriceNum = maxPrice !== undefined ? Number(maxPrice) : undefined;

  const hasValidMinPrice =
    typeof minPriceNum === "number" && !Number.isNaN(minPriceNum);
  const hasValidMaxPrice =
    typeof maxPriceNum === "number" && !Number.isNaN(maxPriceNum);

  if (priceType !== PriceType.FREE && (hasValidMinPrice || hasValidMaxPrice)) {
    andConditions.push({
      price: {
        ...(hasValidMinPrice && { gte: minPriceNum }),
        ...(hasValidMaxPrice && { lte: maxPriceNum }),
      },
    });
  }

  if (priceType === PriceType.FREE) {
    andConditions.push({
      price: null,
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  andConditions.push({
    status: EventStatus.PUBLISHED,
  });

  const whereConditions: Prisma.EventWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  console.log("WHERE:", JSON.stringify({ AND: andConditions }, null, 2));

  const result = await prisma.event.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { registrationDeadline: "desc" },
  });

  const total = await prisma.event.count({
    where: whereConditions,
  });

  console.log(result);

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const updateEvent = async (req: Request): Promise<Event> => {
  console.log(req.body);

  return {};
};

export const EventServices = {
  createEvent,
  getAllPublicEvents,
  updateEvent,
};
