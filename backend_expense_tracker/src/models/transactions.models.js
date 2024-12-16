import mongoose, {Schema, Types} from "mongoose";

const tranactionSchema = new Schema (
    {
        userId:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        category:{
            type:String,
            required:true
        },
        amount:{
            type:Number,
            required:true
        },
        type:{
            type:String,
            required:true,
        },
        invoice:{
            type:String,
        }
    },{
        timestamps:true
    }
);

export const Transaction = mongoose.model("Transaction",tranactionSchema);