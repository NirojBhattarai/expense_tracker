import { Router } from "express";
import {createTransaction} from "../controller/transaction.controller.js";

const router = Router();

router.route('/create').post(createTransaction);

export default router;