import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/users.models.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new apiError(401, "Unauthorized: No token provided");
    }

    const token = authHeader.split(" ")[1]; 
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); 


    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      throw new apiError(401, "Unauthorized: User not found");
    }

    req.user = user; 
    next(); 
  } catch (error) {
    next(new apiError(401, "Unauthorized: Invalid or expired token"));
  }
};
