import httpStatus from "http-status";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import {
  Event,
  EventApprovalStatus,
  EventLifecycleStatus,
  PriceType,
  Prisma,
  UserRole,
} from "@prisma/client";
import { fileUploader } from "../../config/fileUploaders";
import AppError from "../../errorHelpers/AppError";
import prisma from "../../shared/prisma";
import { IEventFilterRequest } from "./event.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../helpers/paginationHelper";
import { eventSearchableFields } from "./event.constants";
import { parsePriceRange } from "../../utils/parsePriceRange";

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

  if (
    req.body.registrationDeadline &&
    req.body.date &&
    new Date(req.body.registrationDeadline) > new Date(req.body.date)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Registration deadline cannot be after event date."
    );
  }

  if (req.body.priceType === "FREE") {
    req.body.price = 0;
  }

  const tags =
    (req.body.tags as string[] | undefined)?.map((t: string) =>
      t.toLowerCase()
    ) ?? [];

  const eventData: Prisma.EventCreateInput = {
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
  const { searchTerm, date, priceType, priceRange, ...filterData } =
    filters;


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

  if (priceRange) {
    const { min, max } = parsePriceRange(priceRange);

    andConditions.push({
      priceType: PriceType.PAID,
      price: {
        not: null,
        ...(min !== undefined && { gte: min }),
        ...(max !== undefined && { lte: max }),
      },
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
    approvalStatus: EventApprovalStatus.PUBLISHED,
    isDeleted: false,
  });

  const whereConditions: Prisma.EventWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  console.log("WHERE1:", JSON.stringify({ AND: andConditions }, null, 2));

  const result = await prisma.event.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { registrationDeadline: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      registrationDeadline: true,
      startTime: true,
      endTime: true,
      location: true,
      priceType: true,
      price: true,
      capacity: true,
      tags: true,
      imageUrl: true,
      participantsCount: true,
      lifecycleStatus: true,
      createdAt: true,
      updatedAt: true,
    },
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

const getAllEvents = async (
  filters: IEventFilterRequest,
  options: IPaginationOptions,
  decodedToken?: JwtPayload
) => {
  const userRole = decodedToken?.role as UserRole | undefined;

  if (userRole === UserRole.ADMIN || userRole === UserRole.HOST) {
    const user = await prisma.userBasicInfo.findFirst({
      where: {
        email: decodedToken?.email,
      },
    });

    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not found.");
    }

    if (user.role !== userRole) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User role mismatch.");
    }
  } else if (userRole === UserRole.SUPER_ADMIN) {
    const user = await prisma.superAdmin.findFirst({
      where: {
        email: decodedToken?.email,
      },
    });

    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Super Admin not found.");
    }
  }

  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const {
    searchTerm,
    date,
    priceType,
    lifecycleStatus,
    priceRange,
    ...filterData
  } = filters;

  console.log("priceRange", priceRange);

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

  if (lifecycleStatus) {
    andConditions.push({
      lifecycleStatus: {
        equals: lifecycleStatus,
      },
    });
  }

  if (priceRange) {
    const { min, max } = parsePriceRange(priceRange);

    andConditions.push({
      priceType: PriceType.PAID,
      price: {
        not: null,
        ...(min !== undefined && { gte: min }),
        ...(max !== undefined && { lte: max }),
      },
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

  const whereConditions: Prisma.EventWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  console.log("WHERE1:", JSON.stringify({ AND: andConditions }, null, 2));

  const result = await prisma.event.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { registrationDeadline: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      registrationDeadline: true,
      startTime: true,
      endTime: true,
      location: true,
      priceType: true,
      price: true,
      capacity: true,
      tags: true,
      imageUrl: true,
      participantsCount: true,
      lifecycleStatus: true,
      createdAt: true,
      updatedAt: true,
    },
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
  const decodedToken = req.user as JwtPayload;

  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.imageUrl = uploadToCloudinary?.secure_url;
  }

  const host = await prisma.host.findFirstOrThrow({
    where: {
      email: decodedToken.email,
      isDeleted: false,
    },
  });

  const event = await prisma.event.findFirstOrThrow({
    where: {
      id: req.params.id,
      isDeleted: false,
      approvalStatus: EventApprovalStatus.PUBLISHED,
    },
  });

  if (host.id !== event.hostId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update event information for another host."
    );
  }

  if (event.lifecycleStatus === EventLifecycleStatus.COMPLETED) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Completed events cannot be updated."
    );
  }

  if (
    req.body.registrationDeadline &&
    req.body.date &&
    new Date(req.body.registrationDeadline) > new Date(req.body.date)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Registration deadline cannot be after event date."
    );
  }

  if (req.body.priceType === "FREE") {
    req.body.price = 0;
  }

  const tags =
    (req.body.tags as string[] | undefined)?.map((t: string) =>
      t.toLowerCase()
    ) ?? [];

  const eventData: Prisma.EventUpdateInput = {
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
    imageUrl: req.body.imageUrl,
  };

  const updatedEvent = await prisma.event.update({
    where: {
      id: req.params.id,
    },
    data: { ...eventData },
  });

  console.log("updatedEvent", updatedEvent);

  return updatedEvent;
};

export const EventServices = {
  createEvent,
  getAllPublicEvents,
  getAllEvents,
  updateEvent,
};
