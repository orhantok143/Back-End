const mongoose = require("mongoose")

const connection = () => {
    mongoose.connect(process.env.MONGO_DB).then(() => console.log("DB is connected succsess")).catch(() => console.log("DB connection is faild"))
}

module.exports = connection