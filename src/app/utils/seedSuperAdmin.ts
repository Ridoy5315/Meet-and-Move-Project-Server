import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import prisma from "../shared/prisma";
import { AuthProvider, Gender, Prisma, UserRole } from "@prisma/client";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await prisma.userBasicInfo.findUnique({
      where: {
        email: envVars.SUPER_ADMIN_EMAIL,
      },
    });

    if (isSuperAdminExist) {
      return;
    }

    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.SALT_ROUND)
    );

    const adminBasicData: Prisma.UserBasicInfoCreateInput = {
      // name: "Super Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      authProvider: AuthProvider.LOCAL,
      role: UserRole.SUPER_ADMIN,
      gender: Gender.MALE,
      isVerified: true,
    };

    const payload = {
      name: "Super Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
    };

    await prisma.$transaction(async (tnx) => {
      await tnx.userBasicInfo.create({
        data: {
          ...adminBasicData,
        },
      });

      await tnx.superAdmin.create({
        data: payload,
      });
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
