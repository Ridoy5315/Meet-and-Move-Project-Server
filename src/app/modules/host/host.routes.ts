import express from 'express';
import { HostController } from './host.controller';


const router = express.Router();


router.get(
    "/:id",
    HostController.getEventsByHostId
);



export const hostRoutes = router;