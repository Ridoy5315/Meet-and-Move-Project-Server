import express from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { userRoutes } from '../modules/user/user.routes';
import { eventRoutes } from '../modules/event/event.routes';
import { hostRoutes } from '../modules/host/host.routes';
import { superAdminRoutes } from '../modules/superAdmin/superAdmin.routes';


const router = express.Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/event',
        route: eventRoutes
    },
    {
        path: '/host',
        route: hostRoutes
    },
    {
        path: '/superAdmin',
        route: superAdminRoutes
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;