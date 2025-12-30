import httpStatus from "http-status";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Event } from "@prisma/client";
import { fileUploader } from "../../config/fileUploaders";
import AppError from "../../errorHelpers/AppError";
import prisma from "../../shared/prisma";

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

  const eventData = {
      title: req.body.title,
      description: req.body.description,
      date: new Date(req.body.date),
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      location: req.body.location,
      isOnline: req.body.isOnline ?? false,
      priceType: req.body.priceType,
      price: req.body.price ?? null,
      capacity: req.body.capacity,
      tags: req.body.tags ?? [],
      imageUrl: req.body.profilePhoto,
      host: {
        connect: {
          id: req.params.id,
        },
      },
    };

  const createdEvent = await prisma.event.create({
     data: {...eventData}
  })

  console.log("createdEvent", createdEvent)

  return createdEvent;
};

export const EventServices = {
  createEvent,
};
