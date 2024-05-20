const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true
    },
        productSku: {
            type: String,
            required: true,
            trim: true
        },
        productName: {
            type: String,
            required: true,
        },
        productPrice: {
            type: Number,
            required: true,
        },
        productShortName: {
            type: String,
            required: true,
        },
        productDescription: {
            type: String,
            required: true,
        },
        createdDate: {
            type: String,
            required: true,
        },
        deliveryTimeSpan: {
            type: String,
            required: true,
        },
        categoryId: {
            type: Number,
            required: true,
        },
        productImageUrl: {
            type: String,
            required: true,
        }
})

module.exports = mongoose.model('Product', productSchema);