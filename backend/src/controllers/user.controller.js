const userService = require("../services/user.service")

async function createUser(req, res) {
    try {
        const {email} = req.body;
        if(!email) {
            return res.status(400).json({error: "email is required"})
        }
        const user = await userService.createUser(email)
        return res.status(201).json(user)
    } catch (error) {
           console.error(error);
    res.status(500).json({error: "internal server error"})
        
    }

}
module.exports = {
    createUser,
}