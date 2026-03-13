const asyncHandler = require("../../utils/asyncHandler");
const authService = require("../../services/auth/auth.me.servcie");


const getMe = asyncHandler(async (req, res) => {
    const user = await authService(req.user.id);
    return res.status(200).json(user);
});

module.exports = getMe ;