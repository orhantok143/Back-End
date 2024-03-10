const express = require("express")
const connection = require("./Db/db")
const userRouter = require("./routers/userRouters")
const { notFound, errorHandler } = require("./middlewares/errorHandler")
const productRouter = require("./routers/productRouters")
const dotenv = require("dotenv").config()
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const blogRouter = require("./routers/blogRouters")
const categoryRouter = require("./routers/prodCategoryRouters")
const blogCategoryRouter = require("./routers/blogCategoryRouters")
const cors = require("cors")
const app = express()

//PORT
const PORT = process.env.PORT || 4000

// DB connection
connection()

//middlewares
app.use(cors())
app.use(morgan("dev"))
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

//Routes
app.use("/api/v1/user", userRouter)
app.use("/api/v1/product", productRouter)
// app.use("/api/v1/blog", blogRouter)
app.use("/api/v1/category", categoryRouter)



//error Handler Middelwares
app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`App run on PORT: ${PORT}`)
})

