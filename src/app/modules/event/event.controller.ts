import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { sendResponse } from "../../shared/sendResponse";
import { EventServices } from "./event.service";
import pick from "../../utils/pick";
import { eventFilterableFields } from "./event.constants";
import { JwtPayload } from "jsonwebtoken";

const createEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await EventServices.createEvent(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Event created and pending admin approval.",
    data: result,
  });
});


const getAllPublicEvents = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, eventFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);


  const result = await EventServices.getAllPublicEvents(filters, options );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All public events fetched successfully.",
    meta: result.meta,
    data: result.data,
  });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, eventFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const decodedToken = req.user as JwtPayload | undefined;

  const result = await EventServices.getAllEvents(filters, options, decodedToken );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Events fetched successfully.",
    meta: result.meta,
    data: result.data,
  });
});

const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await EventServices.updateEvent(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event updated successfully.",
    data: result,
  });
});

export const EventController = {
  createEvent,
  getAllPublicEvents,
  getAllEvents,
  updateEvent,
};
