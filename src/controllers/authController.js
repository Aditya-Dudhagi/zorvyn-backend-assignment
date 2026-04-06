import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { register as registerUser, login as loginUser } from "../services/authService.js";

const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  return sendSuccess(res, 201, "User registered successfully", result);
});

const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  return sendSuccess(res, 200, "Login successful", result);
});

export default {
  register,
  login
};
