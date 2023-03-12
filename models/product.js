//modelo de producto
const mongoose = require('mongoose');
const productSchema= mongoose.Schema({
    id:String,
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    richDescription:String,
    image: {
        type: String,
    },
    images : [ { type: String}] ,
    brand:String,
    price: {
        type: Number,
        required : true
    },
    category : String,
    countInStock: Number,
    ratin : Number,
    isFeatured:Boolean,
    dateCreated: Date
})
// Exportar el modelo de producto
exports.Product = mongoose.model('Product', productSchema)