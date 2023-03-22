// modelo de ordene de item
const mongoose = require('mongoose');
const orderItemsSchema = mongoose.Schema(
    {
     id:String,
     product : String,
     quantity : Number
    }
)
exports.OrderItems= mongoose.model('OrderItems', orderItemsSchema);