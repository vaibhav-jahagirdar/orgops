const {z} = require("zod")

const renameOrgschema = z.object({
    name: z.string()
            .trim()
            .min(3, "Name is required")
            .max(100, "Name is too long")
});

module.exports = {renameOrgschema}