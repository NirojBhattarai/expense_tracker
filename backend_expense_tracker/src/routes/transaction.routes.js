import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  readTransaction,
  updateTransaction,
} from "../controller/transaction.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { authenticateUser } from "../middlewares/authenticateuser.middlewares.js";

const router = Router();

router.route("/create").post(
  authenticateUser, 
  upload.fields([
    {
      name: "invoice",
      maxCount: 1,
    },
  ]),
  createTransaction
);


router.route("/view").post(authenticateUser, readTransaction);


router.route("/update/:transactionId").put(
  authenticateUser, 
  upload.fields([
    {
      name: "invoice",
      maxCount: 1,
    },
  ]),
  updateTransaction
);

router
  .route("/delete/:transactionId")
  .delete(authenticateUser, deleteTransaction);

export default router;
