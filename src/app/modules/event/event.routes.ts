
import { UserRole } from '@prisma/client';
import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';

import { fileUploader } from '../../config/fileUploaders';
import { EventController } from './event.controller';
import { createEventZodSchema, updateEventZodSchema } from './event.validation';



const router = express.Router();


router.post(
    "/create-event/:id",
    checkAuth(UserRole.HOST),
    fileUploader.upload.single('file'),
    validateRequest(createEventZodSchema),
    EventController.createEvent
);

router.get(
    "/",
    EventController.getAllPublicEvents
);

router.get(
    "/all-events",
    checkAuth(UserRole.HOST, UserRole.ADMIN, UserRole.SUPER_ADMIN),
    EventController.getAllEvents
);

router.patch(
    "/update-event/:id",
    checkAuth(UserRole.HOST),
    fileUploader.upload.single('file'),
    validateRequest(updateEventZodSchema),
    EventController.updateEvent
);




export const eventRoutes = router;