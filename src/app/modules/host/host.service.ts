import { Request } from "express";
import { IEventFilterRequest } from "../event/event.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../helpers/paginationHelper";
import {  EventApprovalStatus, PriceType, Prisma } from "@prisma/client";
import { eventSearchableFields } from "../event/event.constants";
import prisma from "../../shared/prisma";



const getEventsByHostId = async (
  filters: IEventFilterRequest,
  options: IPaginationOptions,
  req: Request
) => {
    const {id} = req.params;

  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, date, priceType, minPrice, maxPrice, ...filterData } =
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
    approvalStatus: EventApprovalStatus.PUBLISHED,
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

const softDeleteEvent = async (id: string, email: string) => {

   const host =await prisma.host.findUniqueOrThrow({
        where: {
            email,
            isDeleted: false
        }
    });

    const event = await prisma.event.findFirstOrThrow({
        where: {
            id,
            hostId: host.id,
            isDeleted: false
        }
    });


    const result = await prisma.$transaction(async (transactionClient) => {
        const eventDeletedData = await transactionClient.event.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        });

        await transactionClient.host.update({
            where: {
                email: host?.email
            },
            data: {
                cancelledEvents: {
                    increment: 1
                }
            }
        });

        return eventDeletedData;
    });

    return result;
}

export const HostServices = {
  getEventsByHostId,
  softDeleteEvent
};
