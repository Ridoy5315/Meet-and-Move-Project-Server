import { UserRole } from '@prisma/client';
import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { SuperAdminController } from './superAdmin.controller';


const router = express.Router();


router.post(
    "/create-admin",
    checkAuth(UserRole.SUPER_ADMIN),
    SuperAdminController.createAdmin
);



export const superAdminRoutes = router;