import httpStatus from 'http-status';
import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { sendResponse } from "../../shared/sendResponse";
import { UserService } from './user.service';

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createAdmin(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Admin created successfully.",
    data: result,
  });
});

const becomeHost = catchAsync(async (req: Request, res: Response) => {
  console.log( "become host", req.body)
  const result = await UserService.becomeHost(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Host created successfully.",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {

  const result = await UserService.updateUser(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User updated successfully.",
    data: result,
  });
});

export const UserController = {
  createAdmin,
  becomeHost,
  updateUser
};