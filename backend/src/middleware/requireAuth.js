const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET

function requireAuth (req, res , next) {
    const token = req.cookies?.access_token;
    if(!token) {
        return res.status(401).json({error: "authentication required"})
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET)

        req.user = {
            id: payload.userId
        }

        next();
    } catch (error) {
        return res.status(401).json({error: "invalid or expired token "})
        
    }
}


module.exports = requireAuth;