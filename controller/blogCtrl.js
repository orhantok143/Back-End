const blogModel = require("../models/blogModel.js");
const asyncHandler = require("express-async-handler");
const validateMongodbİd = require("../utils/validateMongodbİd.js");
const createBlog = asyncHandler(async (req, res) => {
 
const newBlog = await blogModel.create(req.body);

  res.json({
    newBlog,
  });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbİd(id);

    const updateBlog = await blogModel.findByIdAndUpdate(
    id,
    req.body,

    {
      new: true,
    }
  );

  res.json({
    updateBlog,
  });
});

const getAllBlog = asyncHandler(async (req, res) => {
  const allBlog = await blogModel.find();

  res.json({
    allBlog,
  });
});

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbİd(id);

  const blog = await blogModel.findById(id).populate("likes").populate("dislikes")

  const updateBlog = await blogModel.findByIdAndUpdate(
    id,
    { $inc: { numViews: 1 } },
    { new: true }
  );
  res.json({
    blog,
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbİd(id);
  const deleteBlog = await blogModel.findByIdAndDelete(id);
  res.json({
    data: deleteBlog,
  });
});

const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongodbİd(blogId);
  const blog = await blogModel.findById(blogId);

  const loginUserId = req?.user?._id;
  const user  = req.user
  const isLiked = blog?.isLiked;
  const alreadyDisliked = blog?.dislikes?.find(
    (userId => userId?.toString() === loginUserId?.toString())
  );

  if (alreadyDisliked) {
    const blog = await blogModel.findByIdAndUpdate(blogId, {
      $pull: { dislikes: loginUserId },
      isDisliked: false,
    },{new:true});
    res.json({
        blog
      })
  }
  if (isLiked) {
    const blog = await blogModel.findByIdAndUpdate(blogId, {
      $pull: { likes: loginUserId },
      isLiked: false,
    },{new:true});
    res.json({
        blog
      })
  }else{
    const blog = await blogModel.findByIdAndUpdate(blogId, {
        $push: { likes: loginUserId },
        isLiked: true,
      },{new:true});
      res.json({
          blog
        })
  }
});


module.exports = {
  createBlog,
  updateBlog,
  getAllBlog,
  getBlog,
  deleteBlog,
  likeBlog
};
