import { prisma } from "../config/prisma.js";
import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../utils/appError.js";

export const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Unauthorized: token missing", 401));
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true
      }
    });

    if (!user) {
      return next(new AppError("Unauthorized: user not found", 401));
    }

    if (user.status !== "ACTIVE") {
      return next(new AppError("User is inactive", 403));
    }

    req.user = user;
    next();
  } catch (_error) {
    next(new AppError("Unauthorized: invalid token", 401));
  }
};
