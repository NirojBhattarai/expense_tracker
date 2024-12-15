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
        invoice:{
            type:String,
            required:true
        }
    },{
        timestamps:true
    }
);

export const Transaction = mongoose.model("Transcation",tranactionSchema);