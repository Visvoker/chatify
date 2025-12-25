import jwt from "jsonwebtoken";
import type { Types } from "mongoose";
import type { Response } from "express";

import { ENV } from "./env.js";

type UserId = string | Types.ObjectId;

export const generateToken = (userId: UserId, res: Response) => {
  const secret = ENV.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign({ userId }, secret, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks: cross-site scripting
    sameSite: "strict", // CSRF attacks
    secure: ENV.NODE_ENV === "development" ? false : true,
  });

  return token;
};
