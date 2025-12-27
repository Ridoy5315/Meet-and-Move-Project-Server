import { Response } from "express";
import { envVars } from "../config/env";

export interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
}

export const setAuthCookies = (res: Response, tokenInfo: AuthTokens, accessTokenMaxAge: number, refreshTokenMaxAge: number) => {
     if(tokenInfo.accessToken) {
          res.cookie("accessToken", tokenInfo.accessToken, {
               secure: true,
               httpOnly: true,
               // secure: envVars.NODE_ENV === "production",
               
               // sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
               sameSite: "none",
               maxAge: accessTokenMaxAge,
          })
     }

     if(tokenInfo.refreshToken){
          res.cookie("refreshToken", tokenInfo.refreshToken, {
               secure: true,
               httpOnly: true,
               // secure: envVars.NODE_ENV === "production",
               
               // sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
               sameSite: "none",
               maxAge: refreshTokenMaxAge,
          })
     }
}