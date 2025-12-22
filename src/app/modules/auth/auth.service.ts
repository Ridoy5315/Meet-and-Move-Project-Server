import httpStatus from "http-status";
import { User, UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import prisma from "../../shared/prisma";
import { CreateUserPayload } from "./auth.validation";
import AppError from "../../errorHelpers/AppError";
import { jwtHelpers } from "../../utils/jwt";

const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(envVars.SALT_ROUND)
  );

  const userBasicData = {
    email: payload.user.email,
    password: hashedPassword,
    role: UserRole.USER,
    gender: payload.gender,
  };

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.userBasicInfo.create({
      data: {
        ...userBasicData,
      },
    });

    const createdUserData = await tnx.user.create({
      data: payload.user,
    });

    return createdUserData;
  });

  return result;
};

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.userBasicInfo.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password.");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    envVars.JWT.JWT_ACCESS_SECRET,
    envVars.JWT.JWT_ACCESS_EXPIRES
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    envVars.JWT.JWT_REFRESH_SECRET,
    envVars.JWT.JWT_REFRESH_EXPIRES
  );

  return {
    userTokens: {
      accessToken,
      refreshToken,
    },
  };
};

export const AuthService = {
  createUser,
  loginUser,
};
