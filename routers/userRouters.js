const express = require("express")
const {
  register,
  login,
  logout,
  getAllUser,
  getaUser,
  updatedUser,
  deleteUser,
  isBlock,
  handleRefreshToken,
  updatePassword,
  forgetPasswordToken,
  resetPassword,
} = require("../controller/userCtrl")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")

const userRouter = express.Router()

userRouter.post("/register", register)
userRouter.post("/login", login)
userRouter.get("/logout", logout)
userRouter.get("/get-all-users", getAllUser)
userRouter.get("/get-user/:_id", getaUser)
userRouter.put("/edit-user/:_id", authMiddleware, isAdmin, updatedUser)
userRouter.delete("/delete-user/:_id", authMiddleware, isAdmin, deleteUser)
userRouter.put("/block-user/:_id", isBlock)
userRouter.get("/refresh", handleRefreshToken)
userRouter.put("/update-password",authMiddleware,updatePassword)
userRouter.post("/forget-password-token",forgetPasswordToken)
userRouter.post("/reset-password/:token",resetPassword)

module.exports = userRouter
