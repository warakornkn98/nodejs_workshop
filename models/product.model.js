const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    created_by: { type: String },
    product_name: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    amount_of_orders: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
