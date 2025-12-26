
import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { createUserZodSchema } from './auth.validation';
import { AuthController } from './auth.controller';
import { UserRole } from '@prisma/client';
import { checkAuth } from '../../middlewares/checkAuth';


const router = express.Router();

router.post(
    "/register", validateRequest(createUserZodSchema), AuthController.createUser
);

router.post(
    '/login',
    AuthController.loginUser
);

router.post(
    '/refresh-token',
    AuthController.refreshToken
)

router.get(
    '/me',
    checkAuth(
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.HOST,
        UserRole.USER
    ),
    AuthController.getMe
)

export const authRoutes = router;