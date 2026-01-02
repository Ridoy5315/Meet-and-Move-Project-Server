import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { sendResponse } from "../../shared/sendResponse";
import pick from "../../utils/pick";
import { eventFilterableFields } from "../event/event.constants";
import { HostServices } from "./host.service";

const getEventsByHostId = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, eventFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await HostServices.getEventsByHostId(filters, options, req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Events of host fetched successfully.",
    meta: result.meta,
    data: result.data,
  });
});

const softDeleteEvent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const decodedToken = req.user;

  const result = await HostServices.softDeleteEvent(id, decodedToken?.email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event has been removed successfully.",
    data: result,
  });
});

export const HostController = {
  getEventsByHostId,
  softDeleteEvent,
};
