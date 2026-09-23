import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../config/jwt.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "First name is required."],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Last name is required."],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Email is required."],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Last name is required."],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return generateAccessToken(this);
};

userSchema.methods.generateRefreshToken = function () {
  return generateRefreshToken(this);
};

export const User = mongoose.model("User", userSchema);
