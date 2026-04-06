import express from "express";
import summaryController from "../controllers/summaryController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { summaryQuerySchema } from "../utils/validators.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(["ANALYST", "ADMIN"]),
  validateRequest(summaryQuerySchema),
  summaryController.getSummary
);

export default router;
