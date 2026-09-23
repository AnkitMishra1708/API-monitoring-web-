import { AsyncHandler, ApiResponse } from "../../utils/index.js";
import {
  registerUserService,
  loginUserService,
  logoutUserService,
  refreshAccessTokenService,
  changePasswordService,
} from "./user.service.js";
import { cookieOptions } from "../../config/cookie.js";

export const registerUser = AsyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const createdUser = await registerUserService({
    firstName,
    lastName,
    email,
    password,
  });

  return res.json(
    new ApiResponse(201, createdUser, "User created successfully.")
  );
});

export const loginUser = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await loginUserService({ email, password });

  const { loggedInUser, accessToken, refreshToken } = user;

  return res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { loggedInUser, accessToken },
        "User loggedIn successfully."
      )
    );
});

export const logoutUser = AsyncHandler(async (req, res) => {
  const userId = req.user.id;

  await logoutUserService(userId);

  return res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged Out successfully."));
});

export const getCurrentUser = AsyncHandler(async (req, res) => {
  return res.json(
    new ApiResponse(200, req.user, "Current user fetched successfully.")
  );
});

export const refreshAccessToken = AsyncHandler(async (req, res) => {
  const incomingRefreshToken = await req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request.");
  }

  const data = await refreshAccessTokenService(incomingRefreshToken);
  const { accessToken, newRefreshToken } = data;

  return res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access token refreshed."
      )
    );
});

export const changePassword = AsyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  const data = await changePasswordService(req.user.id, {
    currentPassword,
    newPassword,
    confirmPassword,
  });

  return res.json(
    new ApiResponse(200, data.updatedUser, "Password changed successfully.")
  );
});

export const deleteUser = AsyncHandler(async (req, res) => {});
