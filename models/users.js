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
    country : String,
    photo : Number,
        isAdmin : {
        type: Boolean,
        default: false
    }
})
productSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
productSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    },
});
// Exportar el modelo de producto
exports.User = mongoose.model('User', userSchema)