import httpStatus from 'http-status';
import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { sendResponse } from "../../shared/sendResponse";
import { EventServices } from './event.service';

const createEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await EventServices.createEvent(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Event created and pending admin approval.",
    data: result,
  });
})

export const EventController = {
     createEvent
};