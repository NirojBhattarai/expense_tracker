import {Transaction} from "../models/transactions.models.js";
import {Category} from "../models/categories.models.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {deleteFromCloudinary} from "../utils/cloudinary.js";

//Create Transaction Function
const createTransaction = asyncHandler(async (req, res) => {
  const { category, amount, type, userId} = req.body;
  
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
      userId:userId,
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

// Read Transactions Function
const readTransaction = asyncHandler(async (req, res) => {
  const _id = req.params.id;

  try {
    const transactions = await Transaction.find({ userId:_id })
      .sort({ createdAt: -1 }) 
      .populate("userId", "name email") 
      .lean(); 

    if (!transactions || transactions.length === 0) {
      return res.send(404, "No transaction Found");
    }

    return res.status(200).json(
      new apiResponse(200, transactions, "Transaction retrieved Successfully")
    );
  } catch (error) {
    console.log("Error Retrieving Transactions", error);
    res.send(500, "Internal Server Error");
  }
});

// Update Transaction Function
const updateTransaction = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;  
  const { category, amount, type} = req.body;

  // Validate required Fields
  if (!amount || !category || !type) {
    throw new apiError(400, "All Fields are Required");
  }

  // Validate Category
  const categoryExists = await Category.findOne({
    name: new RegExp(`^${category}$`, "i"),
    type: new RegExp(`^${type}$`, "i"),
  });

  if (!categoryExists) {
    throw new apiError(400, "Invalid category or type");
  }

  const invoiceLocalPath = req.files?.invoice?.[0]?.path;
  let invoice = null;

  try {
    if (invoiceLocalPath) {
      // Upload new invoice if provided
      invoice = await uploadOnCloudinary(invoiceLocalPath);
      console.log("Invoice uploaded successfully", invoice);
    }
  } catch (error) {
    console.log("Error uploading invoice", error);
  }

  try {
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      throw new apiError(404, "Transaction not found");
    }

    // Update the transaction details
    transaction.category = category || transaction.category;
    transaction.amount = amount || transaction.amount;
    transaction.type = type || transaction.type;
    transaction.invoice = invoice?.url || transaction.invoice;

    await transaction.save();

    return res.status(200).json(new apiResponse(200, "Transaction Updated Successfully"));
  } catch (error) {
    console.log("Transaction Update Failed", error);
    
    if(invoice){
      await deleteFromCloudinary(invoice.public_id);
  }
    throw new apiError(500, "Internal Server Error");
  }
});

// Delete Transaction Function
const deleteTransaction = asyncHandler(async (req, res) => {
  const { transactionId, _id } = req.params;  

  try {
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      throw new apiError(404, "Transaction not found");
    }

    // Delete the transaction
    await transaction.deleteOne();

    return res.status(200).json(new apiResponse(200, "Transaction Deleted Successfully"));
  } catch (error) {
    console.log("Transaction Deletion Failed", error);
    throw new apiError(500, "Internal Server Error");
  }
});


export {
  createTransaction,
  readTransaction,
  updateTransaction,
  deleteTransaction
}