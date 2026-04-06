import { ZodError } from "zod";
import { AppError } from "../utils/appError.js";

export const validateRequest = (schema) => {
  return (req, _res, next) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }

      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((issue) => issue.message).join(", ");
        return next(new AppError(message, 400));
      }
      next(error);
    }
  };
};
