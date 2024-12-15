import mongoose, {Schema} from "mongoose";

const categoriesSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        type:{
            type:String,
            required: true
        }
    }
);

export const Categories = mongoose.model("Catgories",categoriesSchema);