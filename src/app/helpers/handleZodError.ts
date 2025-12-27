import { TGenericErrorResponse, TErrorSources } from "../interfaces/error.types";
import httpStatus from "http-status"

export const handleZodError = (err: any):  TGenericErrorResponse => {
     const errorSources : TErrorSources[] = [];

     err.issues.forEach((issue: any) => {
          errorSources.push({
               path: issue.path[issue.path.length -1],
               message: issue.message
          })
     });

     return {
          statusCode: httpStatus.UNPROCESSABLE_ENTITY,
          message: "Zod Error",
          errorSources
     }
}