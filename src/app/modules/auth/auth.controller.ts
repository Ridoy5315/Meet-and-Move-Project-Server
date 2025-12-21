import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { sendResponse } from "../../shared/sendResponse";
import { authService } from "./auth.service";

const createUser = catchAsync(async (req: Request, res: Response) => {

     const result = await authService.createUser(req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Created successfully.",
    data: result,
  });
});

export const authController = {
  createUser,
};
