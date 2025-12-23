
import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { createUserZodSchema } from './auth.validation';
import { AuthController } from './auth.controller';


const router = express.Router();

router.post(
    "/register", validateRequest(createUserZodSchema), AuthController.createUser
);

router.post(
    '/login',
    AuthController.loginUser
);


export const authRoutes = router;