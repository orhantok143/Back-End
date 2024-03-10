const { createCategory, updateCategory, getCategory, getAllCategory, deleteCategory } = require("../controller/blogCategoryCtrl.js")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const blogCategoryRouter = require("express").Router()



blogCategoryRouter.post("/create",authMiddleware,isAdmin,createCategory)
blogCategoryRouter.put("/:id",authMiddleware,isAdmin,updateCategory).delete("/:id",authMiddleware,isAdmin,deleteCategory).get("/:id",authMiddleware,isAdmin,getCategory)
blogCategoryRouter.get("/",authMiddleware,isAdmin,getAllCategory)




module.exports = blogCategoryRouter