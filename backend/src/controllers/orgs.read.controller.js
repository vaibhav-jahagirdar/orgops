const { listOrgsForUser } = require("../services/orgs.read.service")


async function listMyOrgs( req, res) {
    const userId = req.user.id;

    const orgs =  await listOrgsForUser(userId)

    res.json({ orgs })
}