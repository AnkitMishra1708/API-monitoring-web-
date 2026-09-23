import jwt from "jsonwebtoken";
import { ApiError } from "../../utils/index.js";
import { User } from "./user.model.js";

export const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while generating access or refresh token.",
      error.message
    );
  }
};

export const registerUserService = async (data) => {
  try {
    const { firstName, lastName, email, password } = data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError(409, "User already exist.");
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return { createdUser };
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while registering user.",
      error.message
    );
  }
};

export const loginUserService = async (data) => {
  try {
    const { email, password } = data;

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(409, "User doesn't exist.");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Password is invalid.");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return { loggedInUser, accessToken, refreshToken };
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while registering user.",
      error.message
    );
  }
};

export const logoutUserService = async (userId) => {
  try {
    await User.findByIdAndUpdate(
      userId,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        returnDocument: "after",
      }
    );

    return;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while registering user.",
      error.message
    );
  }
};

export const refreshAccessTokenService = async (incomingRefreshToken) => {
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token.");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used.");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user?._id);

    return { accessToken, newRefreshToken };
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while registering user.",
      error.message
    );
  }
};

export const changePasswordService = async (userId, password) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = password;

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const isPasswordValid = await user.isPasswordCorrect(currentPassword);

    if (!isPasswordValid) {
      throw new ApiError(400, "Password is invalid.");
    }

    if (newPassword === currentPassword) {
      throw new ApiError(
        400,
        "New password must be different from current password."
      );
    }

    if (newPassword !== confirmPassword) {
      throw new ApiError(
        401,
        "New password and confirm password should be same."
      );
    }

    user.password = newPassword;
    await user.save();

    const updatedUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return { updatedUser };
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Something went wrong while registering user.",
      error.message
    );
  }
};
