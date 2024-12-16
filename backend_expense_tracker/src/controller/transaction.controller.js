import {Transaction} from "../models/transactions.models.js";
import {Category} from "../models/categories.models.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {deleteFromCloudinary} from "../utils/cloudinary.js";

const _id = process.env.USER_ID;

const createTransaction = asyncHandler(async (req, res) => {
  const { category, amount, type} = req.body;
  
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

  const invoiceLocalPath = req.files?.invoice?.[0]?.path;

  let invoice;
   try {
     invoice = await uploadOnCloudinary(invoiceLocalPath);
     console.log("Invoice uploaded successfully",invoice);
   } catch (error) {
    console.log("Error Uploading Invoice",error)
   }

  try {
    const transaction = await Transaction.create({
      userId:_id,
      category,
      type,
      amount,
      invoice: invoice.url,
    });

    if (!transaction) {
      throw new apiError(500, "Error while performing transaction");
    }

    return res
      .status(201)
      .json(new apiResponse(201, "Transaction Created Successfully"));
  } catch (error) {
    console.log("Transaction Creation Failed");

    if(invoice){
      await deleteFromCloudinary(invoice.public_id);
  }
    throw new apiError(500, "Internal Server Error");
  }
});

export {createTransaction}