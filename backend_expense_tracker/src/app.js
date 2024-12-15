import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import healthcheckRouter from "./routes/healthcheck.routes.js"
import userRouter from "./routes/user.routes.js"

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}
));

//middlewares
app.use(express.json({limit:"16kb"}));
app.use(urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

//Routes
app.use("/api/v1/healthcheck",healthcheckRouter);
app.use("/api/v1/users",userRouter);

export {app};