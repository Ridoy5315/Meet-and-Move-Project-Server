
import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { createUserZodSchema } from './auth.validation';
import { authController } from './auth.controller';



const router = express.Router();


router.post(
    "/register", validateRequest(createUserZodSchema), authController.createUser
);




export const authRoutes = router;