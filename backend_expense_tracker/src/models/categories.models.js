import mongoose, {Schema} from "mongoose";

const categoriesSchema = new Schema(
    {
        name:{
            type:String,
            required:true,
        },
        type:{
            type:String,
            required: true,
            enum: ["Income", "Expense"]
        }
    }
);

export const Category = mongoose.model("Category",categoriesSchema);