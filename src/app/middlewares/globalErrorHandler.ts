import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { handleZodError } from "../helpers/handleZodError";
import { TErrorSources } from "../interfaces/error.types";
import { envVars } from "../config/env";
import { Prisma } from "@prisma/client";
import { prismaP2002Error, prismaP2025Error } from "../helpers/prismaClientError";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something Went Wrong!";
  let errorSources: TErrorSources[] = [];
  console.log(err)

  if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrorSources[];
  }
  if (err instanceof Prisma.PrismaClientValidationError) {
    message = "Validation Error";
    message = err.message;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const simplifiedError = prismaP2002Error(err);
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      errorSources = simplifiedError.errorSources as TErrorSources[];
    }
    else if (err.code === "P2025") {
      const simplifiedError = prismaP2025Error(err);
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      errorSources = simplifiedError.errorSources as TErrorSources[];
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    // err: envVars.NODE_ENV === "development" ? err : null,
    err: err,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};

export default globalErrorHandler;
