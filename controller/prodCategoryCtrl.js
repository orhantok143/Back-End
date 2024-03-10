const categorySchema = require("../models/categoryModel.js");
const asyncHandler = require("express-async-handler");
const validateMongoDBid = require("../utils/validateMongodbİd");

const createCategory = asyncHandler(async (req, res) => {

  const { title, subCategory, description } = req.body;
  const image = req.body.image;

  try {
    // Cloudinary'ye resmi yükle
    const result = await cloudinary.uploader.upload(image, { folder: 'category-images' });

    // MongoDB'ye ürünü kaydet
    const newProduct = productSchema({
      title,
      subCategory,
      description,
      price,
      image: result.secure_url
    });

    await newProduct.save();

    res.json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ürün eklenirken bir hata oluştu' });
  }


  const newProdCategory = await Category.create(req.body);
  res.json({
    newProdCategory,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBid(id);
  const updatedCategory = await prodCategory.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json({
    updatedCategory,
  });
});

const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBid(id);
  const getaCategory = await prodCategory.findById(id);
  res.json(
    getaCategory,
  );
});

const getAllCategory = asyncHandler(async (req, res) => {

  const getallCategory = await prodCategory.find();
  res.json(
    getallCategory,
  );
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBid(id);
  const deletedCategory = await prodCategory.findByIdAndDelete(id);
  res.json(
    deletedCategory
  );
});



module.exports = { createCategory, updateCategory, getCategory, getAllCategory, deleteCategory };
