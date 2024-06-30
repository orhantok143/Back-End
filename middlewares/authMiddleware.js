const expressAsyncHandler = require("express-async-handler");
const userModel = require("../models/userModel")




const authMiddleware = expressAsyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    const loginUser = await userModel.findOne({ email }).populate("password")
    if (loginUser && (await loginUser.isPasswordMatched(password))) {
        req.user = loginUser
        res.cookie("loginUser", loginUser.refreshToken,
            {
                httpOnly: true,  // XSS saldırılarına karşı koruma
                secure: true,
                sameSite: 'strict' // CSRF saldırılarına karşı koruma
            }
        )
        next()
    } else {
        res.status(401).json({
            sucsess: false,
            message: "Girdiğiniz E-mail veya şifre yanlıştır."
        })

    }
})


const isAdmin = expressAsyncHandler(async (req, res, next) => {
    const user = req.user
    console.log("reqUser::", user);
    if (user) {
        if (user.role === "admin") {
            next()
        } else {
            throw new Error("Giriş yapan kullanıcı Admin değildir.")
        }

    } else {
        throw new Error("Have not user in header")
    }
})




module.exports = { authMiddleware, isAdmin }