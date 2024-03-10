const jwt = require("jsonwebtoken")

const generateRefreshToken = (data) => {
    const token = jwt.sign({ data }, process.env.SECRET)
    return token
}

module.exports = generateRefreshToken