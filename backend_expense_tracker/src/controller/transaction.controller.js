import Transaction from "../models/transactions.models";
import Category from "../models/categories.models";
import { apiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";

const createTransaction = asyncHandler(async (req, res) => {
  const { category, amount, type, invoice } = req.body;

  //Validate required Fields
  if (!amount || !category || !type) {
    throw new apiError(400, "All Fields are Required");
  }

  //Validate Category
  const categoryExists = await Category.findOne({ name: category, type });

  if (!categoryExists) {
    throw new apiError(400, "Invalid categroy or type");
  }
  try {
    const transaction = await Transaction.create({
      userId: req.user._id,
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