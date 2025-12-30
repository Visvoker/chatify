import { NextFunction, Request, Response } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.js";
import { ENV } from "../lib/env.js";
import { AuthUser } from "../type/auth.js";
import { getErrorMessage } from "../utils/error.js";

type JwtUserPayload = JwtPayload & {
  userId: string;
};

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.jwt as string | undefined;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const jwtSecret = ENV.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("❌ JWT_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(token, jwtSecret);

    // jwt.verify 可能回傳 string（例如某些 token 格式），也可能沒有 userId
    if (
      typeof decoded === "string" ||
      !decoded ||
      typeof (decoded as JwtPayload).userId !== "string"
    ) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const { userId } = decoded as JwtUserPayload;

    const user = await User.findById(userId)
      .select("-password")
      .lean<AuthUser>();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", getErrorMessage(error));

    res.status(500).json({ message: "Internal server error" });
  }
};
