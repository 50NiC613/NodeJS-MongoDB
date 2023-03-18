// modelo de órdenes
const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
    id:String,
    orderItems:[String],
    shippingAddress1:String,
    shippingAddress2:String,
    city:String,
    zip:String,
    country:String,
    phone:Number,
    status:String,
    totalPrice:Number,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    dateOrder: Date
});
exports.Order = mongoose.model('Order', orderSchema);