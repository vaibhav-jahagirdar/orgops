const AppError = require("../../utils/AppError");
const { refreshSession } = require("../../services/auth/auth.refresh.service");

async function refreshSessionController(req, res, next) {
  try {
    const refreshToken =
      req.cookies?.refreshToken;
      
    if (!refreshToken) {
      throw new AppError("Refresh token is required", 401, "TOKEN_REQUIRED");
    }

    const { accessToken, refreshToken: newRefreshToken } = await refreshSession(refreshToken);

   const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

res.cookie("refreshToken", newRefreshToken, {
  ...cookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

res.cookie("accessToken", accessToken, {
  ...cookieOptions,
  maxAge: 15 * 60 * 1000,
});

return res.status(200).json({
  success: true,
  message: "Session refreshed successfully",
});
  } catch (error) {
    return next(error);
  }
}

module.exports = { refreshSessionController };