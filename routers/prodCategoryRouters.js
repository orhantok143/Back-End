const { createCategory, updatedCategory, getACategory, getAllCategories, deleteCategory } = require("../controller/catgoryCtrl")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const categoryRouter = require("express").Router()



categoryRouter.post("/create", createCategory)
categoryRouter.put("/:id", updatedCategory).delete("/:_id", deleteCategory).get("/:id", getACategory)
categoryRouter.get("/", getAllCategories)




module.exports = categoryRouter