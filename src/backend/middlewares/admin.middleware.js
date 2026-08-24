import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const verifyAdmin = asyncHandler(async (req, res, next) => {

    if (req.user.role !== "Administrator") {
        throw new ApiError(
            403,
            "Only administrators can access this resource"
        );
    }

    next();
});

export { verifyAdmin };