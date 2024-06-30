const mongoose = require('mongoose') // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },

    // image: {
    //     type: Object,
    //     require: true
    // },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

},
    {
        timestamps: true
    })

//Export the model
module.exports = mongoose.model('Product', productSchema)