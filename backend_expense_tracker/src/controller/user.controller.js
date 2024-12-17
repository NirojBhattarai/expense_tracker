import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/users.models.js";

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "User with email or username already exists");
  }

  try {
    const user = await User.create({
      username: username.toLowerCase(),
      email,
      password,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();


    if (!createdUser) {
      throw new apiError(400, "Something went wrong while registering user");
    }

    return res
      .status(201)
      .json(new apiResponse(201, 
        {
            user: createdUser,
            accessToken,
            refreshToken,
          }, 
        "User Registered Successfully"));
        
  } catch (error) {
    throw new apiError(500, "Internal Server Error");
  }
});

// Login User
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

  const userData = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res.status(200).json(
    new apiResponse(
      200,
      {
        user: userData,
        accessToken,
        refreshToken,
      },
      "Login Successful"
    )
  );
});

// Logout User

const logoutUser = asyncHandler(async (req, res) => {
  try {
    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    throw new apiError(500, "Logout failed");
  }
});

// Refresh Token
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

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

  return res.status(200).json(
    new apiResponse(
      200,
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      "Token refreshed successfully"
    )
  );
});

export { registerUser, loginUser, logoutUser, refreshToken };
