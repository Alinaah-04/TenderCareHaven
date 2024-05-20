const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cartSchema = new mongoose.Schema({
    userId: String,
    items: [
        {
            productId: String,
            quantity: Number,
            image:String,
            name:String,
            price:Number
        }
    ]
});

module.exports = mongoose.model('Cart', cartSchema);