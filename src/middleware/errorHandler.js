import { Prisma } from "@prisma/client";
import { AppError } from "../utils/appError.js";

export const notFound = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

export const errorHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Resource already exists"
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Resource not found"
      });
    }
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
};
