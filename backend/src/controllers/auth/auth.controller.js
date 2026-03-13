const asyncHandler = require("../../utils/asyncHandler");
const { registerSchema, loginSchema } = require("../../schemas/auth.schema");
const authService = require("../../services/auth/auth.service");

const ACCESS_TOKEN_COOKIE_MS = 15 * 60 * 1000; 
const REFRESH_TOKEN_DAYS = parseInt(process.env.REFRESH_TOKEN_DAYS || "7", 10);
const REFRESH_TOKEN_COOKIE_MS = REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000;

const cookieBaseOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

const register = asyncHandler(async (req, res) => {
  const parsed = registerSchema.parse(req.body);

  const { user, accessToken, refreshToken } = await authService.register(parsed);

  res.cookie("accessToken", accessToken, {
    ...cookieBaseOptions,
    maxAge: ACCESS_TOKEN_COOKIE_MS,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieBaseOptions,
    maxAge: REFRESH_TOKEN_COOKIE_MS,
  });

  return res.status(201).json({ user, accessToken });
});

const login = asyncHandler(async (req, res) => {
  const parsed = loginSchema.parse(req.body);

  const { user, accessToken, refreshToken } = await authService.login(parsed);

  res.cookie("accessToken", accessToken, {
    ...cookieBaseOptions,
    maxAge: ACCESS_TOKEN_COOKIE_MS,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieBaseOptions,
    maxAge: REFRESH_TOKEN_COOKIE_MS,
  });

  return res.status(200).json({ user, accessToken });
});

module.exports = { register, login };