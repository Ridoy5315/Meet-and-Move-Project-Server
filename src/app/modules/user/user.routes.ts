
import { UserRole } from '@prisma/client';
import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { becomeHostZodSchema, createAdminZodSchema } from './user.validation';
import { UserController } from './user.controller';
import { fileUploader } from '../../config/fileUploaders';



const router = express.Router();


router.post(
    "/create-admin",
    // checkAuth(UserRole.SUPER_ADMIN),
    fileUploader.upload.single('file'),
    validateRequest(createAdminZodSchema),
    UserController.createAdmin
);

router.post(
    "/become-host",
    checkAuth(UserRole.USER),
    fileUploader.upload.single('file'),
    validateRequest(becomeHostZodSchema),
    UserController.becomeHost
);




export const userRoutes = router;