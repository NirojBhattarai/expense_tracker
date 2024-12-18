import mongoose from "mongoose";
import { Category } from "./src/models/categories.models.js";
import dotenv from "dotenv";

dotenv.config();

const seedCategories = async () => {
  try {
    await mongoose.connect(`${process.env.mongoDB_URI}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const categories = [
      { name: "Rent", type: "Expense" },
      { name: "Utilities", type: "Expense" },
      { name: "Transportation", type: "Expense" },
      { name: "Entertainment", type: "Expense" },
      { name: "Healthcare", type: "Expense" },
      { name: "Education", type: "Expense" },
      { name: "Investments", type: "Income" },
      { name: "Freelance", type: "Income" },
      { name: "Business", type: "Income" },
      { name: "Bonuses", type: "Income" }
    ];

    await Category.insertMany(categories);
    console.log("Categories seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding categories:", error);
    mongoose.connection.close();
  }
};

seedCategories();
