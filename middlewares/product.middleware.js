const { jwtDecode } = require("jwt-decode");
const jwt = require("jsonwebtoken");
const tokenMiddleware = require("../middlewares/token.middleware.js");
const ProductSchema = require("../models/product.model.js");

module.exports = async function (req, res, next) {

  if (!req.headers.authorization) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized",
      data: [],
    });
  }
  
  let id = req.params.id;
  let decoded = req.decoded;

  
  product = await ProductSchema.findOne({ _id: id });

  if (!product) {
    return res.status(404).send({
      success: false,
      message: "Product Not Found",
      data: [],
    });
  }

  if (product.created_by !== decoded.username) {
    return res.status(401).send({
      success: false,
      message: "unauthorized",
      data: [],
    });
  }
  req.product = product;
  console.log("productmiddleware");
  next();
};
