const { createBlog, updateBlog, getAllBlog, getBlog, deleteBlog, likeBlog } = require("../controller/blogCtrl")
const { authMiddleware } = require("../middlewares/authMiddleware")

const blogRouter = require("express").Router()



blogRouter.post("/create-blog",authMiddleware,createBlog)
blogRouter.put("/edit-blog/:id",authMiddleware,updateBlog)
blogRouter.get("/get-all-blog",authMiddleware,getAllBlog)
blogRouter.get("/get-a-blog/:id",authMiddleware,getBlog)
blogRouter.delete("/delete-blog/:id",authMiddleware,deleteBlog)
blogRouter.put("/like-blog/",authMiddleware,likeBlog)










module.exports = blogRouter