import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getUsers as getUsersService,
  updateUserStatus as updateUserStatusService
} from "../services/userService.js";

const getUsers = asyncHandler(async (_req, res) => {
  const users = await getUsersService();
  return sendSuccess(res, 200, "Users fetched successfully", users);
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await updateUserStatusService(req.params.id, req.body.status);
  return sendSuccess(res, 200, "User status updated successfully", user);
});

export default {
  getUsers,
  updateUserStatus
};
