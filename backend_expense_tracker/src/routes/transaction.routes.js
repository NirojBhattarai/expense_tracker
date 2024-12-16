import { Router } from "express";
import {createTransaction} from "../controller/transaction.controller.js";
import {upload} from "../middlewares/multer.middlewares.js"

const router = Router();

router.route('/create').post(
    upload.fields([
        {
            name:"invoice",
            maxCount:1
        },
    ]),createTransaction);

export default router;