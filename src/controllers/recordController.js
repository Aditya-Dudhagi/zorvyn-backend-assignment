import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createRecord as createRecordService,
  getRecords as getRecordsService,
  updateRecord as updateRecordService,
  deleteRecord as deleteRecordService
} from "../services/recordService.js";

const createRecord = asyncHandler(async (req, res) => {
  const record = await createRecordService(req.body);
  return sendSuccess(res, 201, "Record created successfully", record);
});

const getRecords = asyncHandler(async (req, res) => {
  const { records, meta } = await getRecordsService(req.query);
  return sendSuccess(res, 200, "Records fetched successfully", records, meta);
});

const updateRecord = asyncHandler(async (req, res) => {
  const record = await updateRecordService(req.params.id, req.body);
  return sendSuccess(res, 200, "Record updated successfully", record);
});

const deleteRecord = asyncHandler(async (req, res) => {
  await deleteRecordService(req.params.id);
  return sendSuccess(res, 200, "Record deleted successfully", null);
});

export default {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
};
