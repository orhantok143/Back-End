const express = require("express")
const userRouter = require("./routers/userRouters")
const { notFound, errorHandler } = require("./middlewares/errorHandler")
const productRouter = require("./routers/productRouters")
const dotenv = require("dotenv").config()
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const categoryRouter = require("./routers/prodCategoryRouters")
const cors = require("cors")
const connection = require("./Db/db")
const app = express()

//PORT
const PORT = process.env.PORT || 4000

// DB connection
connection()


app.use(cors({ // CORS middleware konfigürasyonu
    origin: ['https://flamingodb.netlify.app', 'https://flamingo-mn.netlify.app', 'http://localhost:3001', 'http://localhost:3000'], // Alan adınızı değiştirin
    // allowedHeaders: ['Content-Type', 'Authorization'], // İzin verilen istek başlıkları
    // exposedHeaders: ['X-Total-Count'], // Açıklanacak yanıt başlıkları

    credentials: true // Gerekirse ekleyin
}));



// app.use(cors())
app.use(morgan("dev"))
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

//Routes
app.use("/api/v1/user", userRouter)
// app.use("/api/v1/admin",)
app.use("/api/v1/product", productRouter)
app.use("/api/v1/category", categoryRouter)



//error Handler Middelwares
app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`App run on PORT: ${PORT}`)
})

