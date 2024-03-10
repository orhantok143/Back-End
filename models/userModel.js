const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        mobile: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        isBlock: { type: Boolean, default: false },
        cart: {
            type: Array,
            default: [],
        },
        refreshToken: {
            type: String,
        },
        address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Produst" }],
        passwordChange: Date,
        passwordResetToken: String,
        passwordResetExpaire: Date
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
    next();
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};





//Export the model
module.exports = mongoose.model("User", userSchema);
