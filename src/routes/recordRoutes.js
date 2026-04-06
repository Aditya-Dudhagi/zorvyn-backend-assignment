import express from "express";
import recordController from "../controllers/recordController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createRecordSchema,
  updateRecordSchema,
  deleteRecordSchema,
  listRecordsQuerySchema
} from "../utils/validators.js";

const router = express.Router();

router.use(authenticate);

router.get("/", authorize(["VIEWER", "ANALYST", "ADMIN"]), validateRequest(listRecordsQuerySchema), recordController.getRecords);
router.post("/", authorize(["ADMIN"]), validateRequest(createRecordSchema), recordController.createRecord);
router.put("/:id", authorize(["ADMIN"]), validateRequest(updateRecordSchema), recordController.updateRecord);
router.delete("/:id", authorize(["ADMIN"]), validateRequest(deleteRecordSchema), recordController.deleteRecord);

export default router;
