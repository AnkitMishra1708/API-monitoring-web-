import express from "express";
import { verifyJwt, validate } from "../../middlewares/index.js";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} from "./user.validation.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
  changePassword,
  deleteUser,
} from "./user.controller.js";

const userRoute = express.Router();

userRoute.route("/register").post(validate(registerSchema), registerUser);
userRoute.route("/login").post(validate(loginSchema), loginUser);
userRoute.route("/logout").post(verifyJwt, logoutUser);
userRoute.route("/getCurrentUser").get(verifyJwt, getCurrentUser);
userRoute.route("/refreshAcessToken").post(refreshAccessToken);
userRoute
  .route("/changePassword")
  .patch(verifyJwt, validate(changePasswordSchema), changePassword);
userRoute.route("/deleteUser").post(verifyJwt, deleteUser);

export { userRoute };
