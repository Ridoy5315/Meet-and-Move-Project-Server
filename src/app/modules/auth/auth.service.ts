import { User, UserRole } from "@prisma/client";
import * as bcrypt from 'bcryptjs';
import { envVars } from "../../config/env";
import prisma from "../../shared/prisma";
import { CreateUserPayload } from "./auth.validation";

const createUser = async (payload: CreateUserPayload): Promise<User> => {

    const hashedPassword: string = await bcrypt.hash(payload.password, Number(envVars.SALT_ROUND))

    const userBasicData = {
        email: payload.user.email,
        password: hashedPassword,
        role: UserRole.USER,
        gender: payload.gender
    }

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.userBasicInfo.create({
            data: {
                ...userBasicData,
            }
        });

        const createdUserData = await tnx.user.create({
            data: payload.user
        });

        return createdUserData;
    });

    return result;
};

export const authService = {
     createUser
}