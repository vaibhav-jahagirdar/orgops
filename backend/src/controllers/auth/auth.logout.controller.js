const logoutUser = require("../../services/auth/auth.logout.service")


async function logoutController (req, res) {
    const refreshToken = req.cookies.refreshToken;

    if(refreshToken) {
        await logoutUser(refreshToken)
    }


    res.clearCookies("refreshToken" ,{
        httpOnly : true,
        secure: true,
        sameSite : strict
    });

    return res.status(200).json({message : "Logged out "})
}