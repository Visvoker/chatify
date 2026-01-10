import { Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";

import { ENV } from "../lib/env.js";
import User from "../models/user.js";
import { getErrorMessage } from "../utils/error.js";

type JwtUserPayload = JwtPayload & {
  userId: string;
};

export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return next(new Error("Unauthorized: No cookies"));
    }

    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => c.split("="))
    );

    const token = cookies.jwt;

    if (!token) {
      return next(new Error("Unauthorized: No token"));
    }

    const decoded = jwt.verify(
      token,
      ENV.JWT_SECRET as string
    ) as JwtUserPayload;

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(new Error("Unauthorized: User not found"));
    }

    socket.user = user;

    next();
  } catch (error) {
    console.log("Error in socket authentication:", getErrorMessage(error));
    next(new Error("Unauthorized - Authentication failed"));
  }
};
