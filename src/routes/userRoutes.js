import express from "express";
import userController from "../controllers/userController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { updateUserStatusSchema } from "../utils/validators.js";

const router = express.Router();

router.use(authenticate, authorize(["ADMIN"]));

router.get("/", userController.getUsers);
router.patch("/:id/status", validateRequest(updateUserStatusSchema), userController.updateUserStatus);

export default router;
