//modelo de usuario
const mongoose = require('mongoose');
const userSchema= mongoose.Schema({
    id:String,
    name: {
        type: String,
    },
    email: {
        type: String,
        required : true,
        unique : true,
    },
    passwordHash: {
        type: String,
    },
    street:String,
    apartment:String,
    city : String,
    zip : String,
    count : String,
    photo : Number,
        isAdmin : {
        type: Boolean,
        default: false
    }
})
// Exportar el modelo de producto
exports.User = mongoose.model('User', userSchema)