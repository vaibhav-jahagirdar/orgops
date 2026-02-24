const asyncHandler = require("../../utils/asyncHandler");
const { registerSchema, loginSchema } = require("../../schemas/auth.schema");
const authService = require("../../services/auth/auth.service");

const register = asyncHandler(async (req, res) => {
  const parsed = registerSchema.parse(req.body);

  const { user, access_token, refreshToken } =
    await authService.register(parsed);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(201).json({
    user,
    access_token,
  });
});

const login = asyncHandler(async (req, res) => {
  const parsed = loginSchema.parse(req.body);

  const { user, access_token, refreshToken } =
    await authService.login(parsed);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    user,
    access_token,
  });
});

module.exports = { register, login };