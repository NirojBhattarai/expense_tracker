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
      { name: "Food", type: "Expense" },
      { name: "Grocery", type: "Expense" },
      { name: "Salary", type: "Income" },
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
