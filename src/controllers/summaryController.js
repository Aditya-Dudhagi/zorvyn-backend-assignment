import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getSummary as getSummaryService } from "../services/summaryService.js";

const getSummary = asyncHandler(async (req, res) => {
  const summary = await getSummaryService(req.query);
  return sendSuccess(res, 200, "Summary fetched successfully", summary);
});

export default {
  getSummary
};
