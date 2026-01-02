import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { sendResponse } from "../../shared/sendResponse";
import { SuperAdminServices } from "./superAdmin.service";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await SuperAdminServices.createAdmin(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Admin account created successfully.",
    data: result,
  });
});

export const SuperAdminController = {
  createAdmin,
};
