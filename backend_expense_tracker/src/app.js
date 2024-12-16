import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import healthcheckRouter from "./routes/healthcheck.routes.js"
import userRouter from "./routes/user.routes.js"

const app = express();
const corsOptions = {
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "*",
      ];
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        // !origin check allows requests from non-browser clients like Postman
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    optionsSuccessStatus: 200, // For legacy browser support
  };
  
  
//middlewares
app.use(express.json({limit:"16kb"}));
app.use(urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors(corsOptions))

//Routes
app.use("/api/v1/healthcheck",healthcheckRouter);
app.use("/api/v1/users",userRouter);

export {app};