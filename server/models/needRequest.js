const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const needRequestSchema = new mongoose.Schema({
    userId: String,
    items: [{
        item: String,
        quantity: Number,
        number: String,
        email: String,
    }],
});
needRequestSchema.index({ userId: 1 });

module.exports = mongoose.model('NeedRequest', needRequestSchema);
