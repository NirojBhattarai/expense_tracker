import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  readTransaction,
  updateTransaction,
} from "../controller/transaction.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/create").post(
  upload.fields([
    {
      name: "invoice",
      maxCount: 1,
    },
  ]),
  createTransaction
);

router.route("/view").post(readTransaction);
router.route("/update/:transactionId").put(
  upload.fields([
    {
      name: "invoice",
      maxCount: 1,
    },
  ]),
  updateTransaction
);
router.route("/delete/:transactionId").delete(deleteTransaction);

export default router;
