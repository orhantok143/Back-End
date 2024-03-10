const categorySchema = require("../models/categoryModel.js")
const asyncHandler = require("express-async-handler")
const validateMongoDBid = require("../utils/validateMongodbİd")

const cloudinary = require('cloudinary').v2;



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


const createCategory = asyncHandler(async (req, res) => {
    const { title, subCategory, image } = req.body;

    try {
        let sub = req.body.subCategory

        const newCat = await categorySchema.findOne({ title })

        if (newCat) {
            const subb = newCat.subCategory?.find(s => s.subCategory === sub)
            console.log("gelen Sub varmı::", subb);
            const { _id } = newCat
            if (!subb) {

                const result = await cloudinary.uploader.upload(image, { folder: 'uploads' });
                const newCategory = {
                    subCategory,
                    image: result
                }
                newCat.subCategory.push(
                    newCategory
                )
                await newCat.save()
                res.json({
                    newCategory,

                })
            }
            else {
                await cloudinary.uploader.destroy(subb.image.public_id);
                const result = await cloudinary.uploader.upload(image, { folder: 'uploads' });



                newCat.image = result

                await newCat.save()


                res.json({
                    newCat,

                })
            }

        }
        else {
            const result = await cloudinary.uploader.upload(image, { folder: 'uploads' });
            const newCategory = await categorySchema.create({
                title,
                subCategory: {
                    subCategory,
                    image: result
                }
            })
            res.json({
                newCategory,
                result
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

const updatedCategory = asyncHandler(async (req, res) => {
    const { _id } = req.params
    validateMongoDBid(_id)
    if (req.body.title) {
        req.body.slug = slugify(req.body.title)
    }
    const category = await categorySchema.findByIdAndUpdate(_id, req.body, { new: true })
    res.status(200).json({
        success: true,
        updatedcategory: category
    })
})

const deleteCategory = asyncHandler(async (req, res) => {
    const { _id } = req.params
    validateMongoDBid(_id)
    await categorySchema.findByIdAndDelete(_id)
    res.status(200).json({
        success: true,
        message: "The category is deleted"
    })
})

const getAllCategories = asyncHandler(async (req, res) => {
    const queryObj = { ...req.query }
    const excludeFields = ["page", "sort", "limit", "fields"]

    //Filtering

    excludeFields.forEach(item => delete queryObj[item])
    let queryString = JSON.stringify(queryObj)
    queryString = queryString.replace(/\b(gte|gt|lte)\b/g, (match) => `$${match}`)
    let query = categorySchema.find(JSON.parse(queryString))

    //Sorting

    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ")
        query = query.sort(sortBy)

    } else {
        query = query.sort("-createdAt")
    }

    //Limiting 

    if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ")
        query = query.select(fields)

    } else {
        query = query.select("-__v")
    }

    //Pagenation

    const page = req.query.page
    const limit = req.query.limit
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)
    if (req.query.page) {
        const categoryCount = await categorySchema.countDocuments()
        if (skip >= categoryCount) throw new Error("This page does not exits")
    }


    const categories = await query
    res.status(200).json({
        categories
    })
})

const getACategory = asyncHandler(async (req, res) => {
    const { _id } = req.params
    validateMongoDBid(_id)
    const category = await categorySchema.findOne({ _id })
    res.status(200).json({
        success: true,
        category
    })
})

module.exports = { createCategory, updatedCategory, deleteCategory, getAllCategories, getACategory }

