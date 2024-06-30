const productSchema = require("../models/productModel")
const asyncHandler = require("express-async-handler")
const validateMongoDBid = require("../utils/validateMongodbİd");
const connection = require("../Db/db");

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const createProduct = asyncHandler(async (req, res) => {
    const { title, category, subCategory, description, price, image } = req.body;
    try {
        const result = await cloudinary.uploader.upload(image)
        const newProduct = await productSchema.create({
            title,
            category,
            subCategory,
            description,
            price,
            image: result,
            // userId: req.user.data
        });

        res.json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ürün eklenirken bir hata oluştu' });
    }
})


const updatedProduct = asyncHandler(async (req, res) => {
    const { title, category, subCategory, description, price, image } = req.body;
    const { _id } = req.params
    validateMongoDBid(_id)
    // console.log(req.body.image);
    if (image.asset_id) {
        const newProduct = {
            title,
            category,
            subCategory,
            description,
            price,
            image
        };
        const product = await productSchema.findByIdAndUpdate(_id, newProduct, { new: true })
        res.status(200).json({
            product
        })
    } else {
        const p = await productSchema.findOne({ _id })
        await cloudinary.uploader.destroy(p.image.public_id);
        const result = await cloudinary.uploader.upload(req.body.image);
        const newProduct = {
            title,
            category,
            subCategory,
            description,
            price,
            image: result
        };
        const product = await productSchema.findByIdAndUpdate(_id, newProduct, { new: true })
        res.status(200).json({
            product
        })
    }
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { _id } = req.params
    console.log(_id);
    validateMongoDBid(_id)

    const p = await productSchema.findById(_id)
    // console.log("p:::", p)

    await productSchema.findByIdAndDelete(_id)
    await cloudinary.uploader.destroy(p.image.public_id);
    console.log("The product is deleted")
    res.status(200).json({
        success: true,
        message: "The product is deleted"
    })
})

const getAllProducts = asyncHandler(async (req, res) => {
    const product = await productSchema.find()
    res.status(200).json({
        product
    })
})

const getAProduct = asyncHandler(async (req, res) => {
    const { _id } = req.params
    validateMongoDBid(_id)
    const product = await productSchema.findOne({ _id })
    res.status(200).json({
        product
    })
})

module.exports = { createProduct, updatedProduct, deleteProduct, getAllProducts, getAProduct }

