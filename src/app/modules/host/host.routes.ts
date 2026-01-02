import express from 'express';
import { HostController } from './host.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { UserRole } from '@prisma/client';


const router = express.Router();


router.get(
    "/:id",
    HostController.getEventsByHostId
);

router.delete(
    "/event/softDelete/:id",
    checkAuth(UserRole.HOST),
    HostController.softDeleteEvent
);



export const hostRoutes = router;