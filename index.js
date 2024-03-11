const express = require("express")
const connection = require("./Db/db")
const userRouter = require("./routers/userRouters")
const { notFound, errorHandler } = require("./middlewares/errorHandler")
const productRouter = require("./routers/productRouters")
const dotenv = require("dotenv").config()
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const categoryRouter = require("./routers/prodCategoryRouters")
const cors = require("cors")
const { newCors } = require("./middlewares/authMiddleware")
const app = express()

//PORT
const PORT = process.env.PORT || 4000

// DB connection
connection()

//middlewares
// Assuming Node.js with Express
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'https://flamingodb.netlify.app', 'https://flamingo-mn.netlify.app');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Add this line
//     next();
// });


app.use(morgan("dev"))
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

//Routes
app.use("/api/v1/user", userRouter)
app.use("/api/v1/product", productRouter)
app.use("/api/v1/category", categoryRouter)



//error Handler Middelwares
app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`App run on PORT: ${PORT}`)
})

