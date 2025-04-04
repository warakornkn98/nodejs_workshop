const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    username: { type: String },
    product_name: { type: String },
    price: { type: String },
    quantity: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
