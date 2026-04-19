const { projectInfo } = require("../services/project.read.service")

async function getProjectDetailController(req, res, next) {
    const currentUserRole = req.membership.role;
  try {
    
    const { projectId } = req.params
    const { orgId } = req.params 

    const result = await projectInfo({ projectId, orgId })

    return res.status(200).json({...result, currentUserRole})
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
        
      })
    }
    return next(err)
  }
}

module.exports = { getProjectDetailController }