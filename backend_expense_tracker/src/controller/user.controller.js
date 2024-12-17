import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/users.models.js";

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if ([username, email, password].some((field) => field?.trim() === "")) {
        throw new apiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new apiError(409, "User with email or username already exists");
    }

    try {
        const user = await User.create({
            username: username.toLowerCase(),
            email,
            password
        });

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createdUser) {
            throw new apiError(400, "Something went wrong while registering user");
        }

        return res
            .status(201)
            .json(new apiResponse(201, createdUser, "User Registered Successfully"));
    } catch (error) {
        throw new apiError(500, "Internal Server Error");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if ([email, password].some((field) => field?.trim() === "")) {
        throw new apiError(400, "Email and Password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new apiError(401, "Invalid email or password");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new apiError(401, "Invalid email or password");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure:  process.env.NODE_ENV === 'production',
        sameSite: "None",
        maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure:  process.env.NODE_ENV === 'production',
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userData = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .json(new apiResponse(200, userData, "Login Successful"));
});

const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        throw new apiError(403, "Refresh token is missing");
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
        throw new apiError(403, "Invalid refresh token");
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure:  process.env.NODE_ENV === 'production',
        sameSite: "None",
        maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly:  process.env.NODE_ENV === 'production',
        secure: false,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res
        .status(200)
        .json(new apiResponse(200, null, "Token refreshed successfully"));
});

export {
    registerUser,
    loginUser,
    refreshToken
};
