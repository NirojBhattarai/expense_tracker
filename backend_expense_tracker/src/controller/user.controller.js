import { asyncHandler } from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js";
import { User } from "../models/users.models.js";

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // User validation
    if (
        [username, email, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new apiError(400, "All fields are required");
    }

   const existedUser = await User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new apiError(409,"User with email or username already exists");
    }

   
    // Creating user 
    try {
        const user = await User.create({
            username : username.toLowerCase(),
            email,
            password
        });
    
       const createdUser = await User.findById(user._id).select("-password -refreshToken");
    
       if(!createdUser){
         throw new apiError(400, "Something went wrong while registering user");
       }
    
       return res
            .status(202)
            .json(new apiResponse(200, createdUser, "User Registered Successfully"))
    } catch (error) {
        console.log("User Creation Failed");
        throw new apiError(500, "Internal Server Error");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate input fields
    if ([email, password].some((field) => field?.trim() === "")) {
        throw new apiError(400, "Email and Password are required");
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
        throw new apiError(401, "Invalid email or password");
    }

    // Compare passwords
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new apiError(401, "Invalid email or password");
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Update refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    // Send response
    const userData = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .json(new apiResponse(200, { user: userData, accessToken, refreshToken }, "Login Successful"));
});

export { 
    registerUser,
    loginUser
 };