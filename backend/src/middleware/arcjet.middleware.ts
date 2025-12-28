import type { Request, Response, NextFunction } from "express";
import { isSpoofedBot } from "@arcjet/inspect";

import aj from "../lib/arcjet.js";

export const arcjetProtection = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({
          message: "Rate limit exceeded. Please try again later.",
        });
        return;
      }

      if (decision.reason.isBot()) {
        res.status(403).json({
          message: "Bot access denied.",
        });
        return;
      }

      res.status(403).json({
        message: "Access denied by security policy.",
      });
      return;
    }

    // 檢查偽裝 bot（spoofed bot）
    if (decision.results.some(isSpoofedBot)) {
      res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected.",
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Arcjet Protection Error:", error);
    next(error);
  }
};
