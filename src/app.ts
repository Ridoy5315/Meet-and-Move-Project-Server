import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

import router from './app/routes';
import { envVars } from './app/config/env';

const app: Application = express();
app.use(cors({
    // origin: envVars.FRONTEND_URL,
    origin: ["http://localhost:3000", "https://meet-and-move-project-client.vercel.app"],
    credentials: true
}));

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "Ph health care server..",
        environment: envVars.NODE_ENV,
        uptime: process.uptime().toFixed(2) + " sec",
        timeStamp: new Date().toISOString()
    })
});

app.use('/api', router);

app.use(globalErrorHandler);

app.use(notFound);

export default app;