const { createProduct, updatedProduct, deleteProduct, getAllProducts, getAProduct } = require("../controller/productCtrl")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")

const productRouter = require("express").Router()


productRouter.post("/add-product", createProduct)
productRouter.put("/edit-product/:_id", authMiddleware, isAdmin, updatedProduct)
productRouter.delete("/delete-product/:_id", deleteProduct)
productRouter.get("/get-all-products", getAllProducts)
productRouter.get("/get-a-product/:_id", getAProduct)



module.exports = productRouter