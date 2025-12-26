import { JwtPayload } from "jsonwebtoken";
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

  if (!userData.password) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password.");
  }

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

const refreshToken = async (token: string) => {
  let decodedData: JwtPayload;

  try {
    const decoded = jwtHelpers.verifyToken(
      token,
      envVars.JWT.JWT_REFRESH_SECRET
    );

    if (typeof decoded === "string") {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token.");
    }

    decodedData = decoded;
  } catch (err) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired refresh token. Please log in again."
    );
  }

  const userData = await prisma.userBasicInfo.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

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

const getMe = async (user) => {
  const userData = await prisma.userBasicInfo.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,

      user: true,
      host: true,
      admin: true,
      superAdmin: true,
    },
  });

  let profile = null;

  switch (userData.role) {
    case "HOST":
      profile = userData.host;
      break;

    case "ADMIN":
      profile = userData.admin;
      break;

    case "SUPER_ADMIN":
      profile = userData.superAdmin;
      break;

    default:
      profile = userData.user;
  }

  return {
    id: userData.id,
    email: userData.email,
    role: userData.role,
    status: userData.status,
    isVerified: userData.isVerified,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt,
    profile,
  };
};

export const AuthService = {
  createUser,
  loginUser,
  refreshToken,
  getMe,
};
