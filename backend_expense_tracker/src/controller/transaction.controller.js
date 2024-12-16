import {Transaction} from "../models/transactions.models.js";
import {Category} from "../models/categories.models.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTransaction = asyncHandler(async (req, res) => {
  const { category, amount, type, invoice } = req.body;
  
  //Validate required Fields
  if (!amount || !category || !type) {
    throw new apiError(400, "All Fields are Required");
  }

  //Validate Category
  const categoryExists = await Category.findOne({
    name: new RegExp(`^${category}$`, "i"),
    type: new RegExp(`^${type}$`, "i"),
  });

  if (!categoryExists) {
    throw new apiError(400, "Invalid categroy or type");
  }

  try {
    const transaction = await Transaction.create({
      userId: "675ee8b8eefd45e72660c0d4",
      category,
      type,
      amount,
      invoice,
    });

    if (!transaction) {
      throw new apiError(500, "Error while performing transaction");
    }

    return res
      .status(201)
      .json(new apiResponse(201, "Transaction Created Successfully"));
  } catch (error) {
    console.log("Transaction Creation Failed");
    throw new apiError(500, "Internal Server Error");
  }
});

export {createTransaction}