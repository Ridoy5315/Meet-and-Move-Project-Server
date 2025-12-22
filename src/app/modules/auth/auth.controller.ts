import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { sendResponse } from "../../shared/sendResponse";
import { AuthService } from "./auth.service";
import { setAuthCookies } from "../../utils/setCookie";
import { envVars } from "../../config/env";
import { getCookieMaxAge } from "../../utils/cookieExpiry";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.createUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Created successfully.",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  // convert accessTokenExpiresIn to milliseconds
  const accessTokenMaxAge = getCookieMaxAge(envVars.JWT.JWT_ACCESS_EXPIRES);

  // convert refreshTokenExpiresIn to milliseconds
  const refreshTokenMaxAge = getCookieMaxAge(envVars.JWT.JWT_REFRESH_EXPIRES);

  const result = await AuthService.loginUser(req.body);

  setAuthCookies(res, result.userTokens, accessTokenMaxAge, refreshTokenMaxAge);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully!",
    data: {},
  });
});

export const AuthController = {
  createUser,
  loginUser,
};
