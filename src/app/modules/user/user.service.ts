import httpStatus from "http-status";
import { Admin, Host, UserRole } from "@prisma/client";
import { Request } from "express";
import { fileUploader } from "../../config/fileUploaders";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../shared/prisma";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../config/env";

const createAdmin = async (req: Request): Promise<Admin> => {

  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }

  await prisma.superAdmin.findFirstOrThrow({
    where: {
      email: envVars.SUPER_ADMIN_EMAIL
    },
  });

  const existingAdmin = await prisma.admin.findFirst({
    where: {
      email: req.body.email,
      isDeleted: false,
    },
  });

  if (existingAdmin) {
    throw new AppError(httpStatus.CONFLICT, "You are already an admin.");
  }

  console.log("req.body", req.body);

  const {
    name,
    username,
    email,
    contactNumber,
    dateOfBirth,
    gender,
    bio,
    address,
    profilePhoto,
  } = req.body;

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.userBasicInfo.update({
      where: {
        email: req.body.email,
      },
      data: {
        role: UserRole.ADMIN,
      },
    });

    const createdAdminData = await tnx.admin.create({
      data: {
        name,
        username,
        email,
        contactNumber,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        bio,
        address,
        profilePhoto,
      },
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
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
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

  const existingHost = await prisma.host.findFirst({
    where: {
      email: decodedToken.email,
      isDeleted: false,
    },
  });

  if (existingHost) {
    switch (existingHost.hostStatus) {
      case "PENDING":
        throw new AppError(
          httpStatus.CONFLICT, // 409
          "You have already applied to become a host. Please wait for approval."
        );

      case "APPROVED":
        throw new AppError(
          httpStatus.CONFLICT, // 409
          "You are already an approved host."
        );

      case "REJECTED":
        throw new AppError(
          httpStatus.FORBIDDEN, // 403
          "Your previous host application was not approved. Please contact our support team or an administrator for guidance."
        );

      default:
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Unable to process your host application at this time."
        );
    }
  }

  console.log("req.body", req.body);

  const {
    name,
    username,
    email,
    contactNumber,
    dateOfBirth,
    gender,
    organization,
    experienceLevel,
    bio,
    address,
    profilePhoto,
  } = req.body;

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
      data: {
        name,
        username,
        email,
        contactNumber,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        organization,
        experienceLevel: Number(experienceLevel),
        bio,
        address,
        profilePhoto,
      },
    });

    return createdHostData;
  });

  return result;
};

export const UserService = {
  createAdmin,
  becomeHost,
};
