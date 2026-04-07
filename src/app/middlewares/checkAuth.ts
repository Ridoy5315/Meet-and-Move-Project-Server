import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { jwtHelpers } from "../utils/jwt";
import prisma from "../shared/prisma";
import { UserStatus } from "@prisma/client";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const accessToken = req.headers.authorization || req.cookies.accessToken;

      if (!accessToken) {
        {
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            "Authentication token is missing. Please log in."
          );
        }
      }

      const verifiedToken = jwtHelpers.verifyToken(
        accessToken,
        envVars.JWT.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await prisma.userBasicInfo.findFirstOrThrow({
        where: {
          email: verifiedToken.email,
          status: UserStatus.ACTIVE,
        },
      });

      // if (!isUserExist.isVerified) {
      //   throw new AppError(
      //     httpStatus.FORBIDDEN,
      //     "Account not verified. Please verify your email to continue."
      //   );
      // }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You do not have permission to access this resource."
        );
      }

      req.user = verifiedToken;

      next();
    } catch (error) {
      next(error);
    }
  };
