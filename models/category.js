// modelo de categoría
const mongoose = require("mongoose");
const categorySchema = mongoose.Schema({
  name: { type: String, required: true },
  color: String,
  icon: String,
});
// hacer el id frontend friendly
categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});
categorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});
exports.Category = mongoose.model("Category", categorySchema);
