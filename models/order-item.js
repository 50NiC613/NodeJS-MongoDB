// modelo de ordene de item
const mongoose = require('mongoose');
const orderItemsSchema = mongoose.Schema(
    {
     product : {
         type : mongoose.Schema.Types.ObjectId,
     ref:'Product'},
     quantity : {type:Number,
     required : true}
    }
)
exports.OrderItem= mongoose.model('OrderItem', orderItemsSchema);