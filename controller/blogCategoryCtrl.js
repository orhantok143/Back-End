const blogCategory = require("../models/blogCategoryModel.js");
const asyncHandler = require("express-async-handler");
const validateMongoDBid = require("../utils/validateMongodbİd.js");

const createCategory = asyncHandler(async (req, res) => {
  const newProdCategory = await blogCategory.create(req.body);
  res.json({
    newProdCategory,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBid(id);
  const updatedCategory = await blogCategory.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json({
    updatedCategory,
  });
});

const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBid(id);
  const getaCategory = await blogCategory.findById(id);
  res.json(
    getaCategory,
  );
});

const getAllCategory = asyncHandler(async (req, res) => {
    
    const getallCategory = await blogCategory.find();
    res.json(
      getallCategory,
    );
  });

  const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDBid(id);
    const deletedCategory = await blogCategory.findByIdAndDelete(id);
    res.json(
      deletedCategory
    );
  });



module.exports = { createCategory, updateCategory, getCategory,getAllCategory,deleteCategory };
