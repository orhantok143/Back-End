const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDBid = require("../utils/validateMongodbİd");
const generateRefreshToken = require("../config/refreshtokengenerator");
const { generateToken } = require("../config/generateToken.js");

const jwt = require("jsonwebtoken");
const sendMail = require("./emailCtrl.js");
const crypto = require("crypto");

const register = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const validemail = await userModel.findOne({ email });
  if (!validemail) {
    const user = await userModel.create(req.body);
    res.status(200).json({
      success: true,
      data: user,
    });
  } else {
    throw new Error("User Already Exits");
  }
});

const login = asyncHandler(async (req, res) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');

  const { email, password } = req.body;
  // check if user exists or not
  const findAdmin = await userModel.findOne({ email });
  if (!findAdmin) {
    throw new Error("Kullanıcı bulunamadı");
  }
  // let passmatch = await findAdmin.isPasswordMatched(password)
  if (findAdmin.role !== "admin") throw new Error("Not Authorised");
  if (findAdmin) {
    // console.log("passmatch", password);
    const refreshToken = generateRefreshToken(findAdmin?._id);
    const updateuser = await userModel.findByIdAndUpdate(
      findAdmin._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      username: findAdmin?.username,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: refreshToken,
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await userModel.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await userModel.findOneAndUpdate({ refreshToken }, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});


// const logout = asyncHandler(async (req, res) => {
//   const { refreshToken } = req.cookies;

//   if (!refreshToken) throw new Error("No Access Token in Cookies");
//   const user = await userModel.findOne({ refreshToken: refreshToken });
//   if (!user) {
//     res.clearCookie("refreshToken", {
//       httpOnly: true,
//       secure: true,
//     });
//     return res.sendStatus(204); //forbiden
//   }
//   await userModel.findOneAndUpdate(
//     { refreshToken },
//     { refreshToken: "" }
//   );
//   res.clearCookie("refeshToken", {
//     httpOnly: true,
//     secure: true,
//   });
//   return res.sendStatus(204); //forbiden
// });

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const alluser = await userModel.find();
    res.json({
      success: true,
      data: alluser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getaUser = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  validateMongoDBid(_id);
  try {
    const user = await userModel.findById(_id);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatedUser = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  validateMongoDBid(_id);
  try {
    const user = await userModel.findByIdAndUpdate({ _id }, req.body, {
      new: true,
    });
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  validateMongoDBid(_id);
  try {
    const user = await userModel.findByIdAndDelete(_id);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const isBlock = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  validateMongoDBid(_id);
  try {
    const user = await userModel.findById(_id);
    if (user.isBlock == true) {
      user.isBlock = false;
      await userModel.findByIdAndUpdate({ _id }, user, { new: true });
    } else {
      user.isBlock = true;
      await userModel.findByIdAndUpdate({ _id }, user, { new: true });
    }
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const handleRefreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.accesstoken;
  if (!refreshToken) throw new Error("No Access token in cookies");
  const user = await userModel.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh Token present in DB");
  jwt.verify(refreshToken, process.env.SECRET, (err, decode) => {
    if (err || user.id !== decode.data) {
      throw new Error("There is something wrong with refresh token");
    } else {
      const newRefreshToken = refreshtokengenerator(user.id);
      res.json({
        newRefreshToken,
      });
    }
  });
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDBid(_id);
  const user = await userModel.findById(_id);
  if (password) {
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword);
  } else res.json(user);
});

const forgetPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) throw new Error("Bu mail'e ait kullanıcı bulunmadı");
  const token = await user.createPasswordResetToken();
  await user.save();
  const resetURL = `Hi, Please follow this link for reset your password. This link is valid till 10m from now. <a href= 'http://localhost:5000/api/v1/user/reset-password/${token}'>Click here</a> `;
  const data = {
    to: email,
    subject: "Forget Password Link",
    text: "Hey user",
    htm: resetURL,
  };
  sendMail(data);
  res.json(token);
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, cpassword } = req.body;
  const { token } = req.params;
  if (password === cpassword) {
    const hashedToken = await crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const user = await userModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpaire: { $gt: Date.now() },
    });
    if (!user) throw new Error("Token Expaired, please try again later");
    user.password = password;
    passwordResetToken = undefined;
    passwordResetExpaire = undefined;
    await user.save();
    res.json(user);
  } else throw new Error("İki şifre eşleşmiyor.")
});

module.exports = {
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
};
