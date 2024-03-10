const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")

const authMiddleware = expressAsyncHandler(async(req,res,next)=>{
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token) {
                const decoded = jwt.verify(token,process.env.SECRET)
                const user = await userModel.findById(decoded.data)
                req.user = user
                next()
            }
        } catch (error) {
            throw new Error("Not Authorized token expaired, Please login again")
        }
    }else{
        throw new Error("There is no token attached to header")
    }
})

const isAdmin = expressAsyncHandler(async(req,res,next)=>{
    const user = req.user
    if (user) {
       if (user.role === "admin") {
            next()
       } else {
            throw new Error("The Logined User is Not Admin")
       }
       
   } else {
        throw  new Error("Have not user in header")
   }
})


module.exports = {authMiddleware,isAdmin}