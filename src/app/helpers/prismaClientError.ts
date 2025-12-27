

/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types";



export const prismaP2002Error = (err: any):  TGenericErrorResponse => {
     const errorSources : TErrorSources[] = [];

     const duplicatedField = Array.isArray(err.meta?.target)
    ? err.meta.target.join(", ")
    : err.meta?.target || "unknown";

  errorSources.push({
    path: duplicatedField,
    message: `${duplicatedField} already exists`,
  });

  return {
    statusCode: 400,
    message: "Duplicate Key Error",
    errorSources,
  };
}

export const prismaP2025Error = (err: any):  TGenericErrorResponse => {
     const errorSources : TErrorSources[] = [];

     const noRecordData = Array.isArray(err.meta?.modelName)
    ? err.meta.modelName.join(", ")
    : err.meta?.modelName || "unknown";

  errorSources.push({
    path: noRecordData,
    message: `No account found with this ${noRecordData}`,
  });

  return {
    statusCode: 400,
    message: "No account found",
    errorSources,
  };
}