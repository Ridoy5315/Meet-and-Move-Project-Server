
import { UserRole } from '@prisma/client';
import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';

import { fileUploader } from '../../config/fileUploaders';
import { EventController } from './event.controller';
import { createEventZodSchema } from './event.validation';



const router = express.Router();


router.post(
    "/create-event/:id",
    checkAuth(UserRole.HOST),
    fileUploader.upload.single('file'),
    validateRequest(createEventZodSchema),
    EventController.createEvent
);




export const eventRoutes = router;