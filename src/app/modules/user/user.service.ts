import httpStatus from "http-status";
import { Admin, Host, UserRole } from "@prisma/client";
import { Request } from "express";
import { fileUploader } from "../../config/fileUploaders";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../shared/prisma";
import AppError from "../../errorHelpers/AppError";

const createAdmin = async (req: Request): Promise<Admin> => {
  const decodedToken = req.user as JwtPayload;

  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: decodedToken.email,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.userBasicInfo.update({
      where: {
        email: req.body.admin.email,
      },
      data: {
        role: UserRole.ADMIN,
      },
    });

    const createdAdminData = await tnx.admin.create({
      data: req.body.admin,
    });

    return createdAdminData;
  });

  return result;
};

const becomeHost = async (req: Request): Promise<Host> => {
  const decodedToken = req.user as JwtPayload;

  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.host.profilePhoto = uploadToCloudinary?.secure_url;
  }

  if (decodedToken.email !== req.body.email) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to submit host information for another account."
    );
  }

  await prisma.user.findFirstOrThrow({
    where: {
      email: decodedToken.email,
      isDeleted: false,
    },
  });

  await prisma.host.findFirstOrThrow({
    where: {
      email: decodedToken.email,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.userBasicInfo.update({
      where: {
        email: req.body.email,
      },
      data: {
        role: UserRole.HOST,
      },
    });

    const createdHostData = await tnx.host.create({
      data: req.body,
    });

    return createdHostData;
  });

  return result;
};

export const UserService = {
  createAdmin,
  becomeHost,
};
