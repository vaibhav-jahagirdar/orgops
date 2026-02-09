const orgService = require("../services/orgs.service")

async function createOrg(req, res ) {
   try {
    const {name} = req.body;
    if(!name) {
        return res.status(400).json({error: "name is required"});
    }
    const org = await orgService.createOrg(name);

    res.status(201).json(org);
   } catch (error) {
    console.error(err);
    res.status(500).json({error: "internal server error"})
    
   }   
}

module.exports = {
    createOrg,
}