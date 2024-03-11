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
const app = express()

//PORT
const PORT = process.env.PORT || 4000

// DB connection
connection()
// Enable CORS for specific origins(replace with your actual domain names)
// const allowedOrigins = ['https://flamingodb.netlify.app', 'https://flamingo-mn.netlify.app'];
// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.indexOf(origin) === -1) {
//             var message = 'This request is not allowed from origin: ' + origin;
//             return callback(new Error(message), false);
//         }
//         callback(null, true);
//     }
// }));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://flamingodb.netlify.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT,DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // res.setHeader('Access-Control-Allow-Credentials', true); // Added line
    next();
});

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

