var express = require("express");
var router = express.Router();
var ProductSchema = require("../models/product.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenMiddleware = require("../middlewares/token.middleware.js");

// Get all products
router.get("/", async function (req, res, next) {
  try {
    let products = await ProductSchema.find({});

    res.status(200).send({
      success: true,
      message: "Success",
      error:[],
      data: products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Server Timeout",
      error:[],
      data: [],
    });
  }
});

// Add a new product
router.post("/", async function (req, res, next) {
  let { product_name, price, quantity } = req.body;

  try {

    product = new ProductSchema({
      product_name, price, quantity
    });

    await product.save();

    res.status(200).send({
      success: true,
      message: "Success",
      error:[],
      data: product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Server Timeout",
      error:[],
      data: [],
    });
  }
});

// Update a product
router.put("/:id", async function (req, res, next) {
  let { product_name, price, quantity } = req.body;
  let { id } = req.params;

  try {

    product = await ProductSchema.findByIdAndUpdate(id,{
      product_name, price, quantity
    },{ new: true });

    res.status(200).send({
      success: true,
      message: "Success",
      error:[],
      data: product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Server Timeout",
      error:[],
      data: [],
    });
  }
});

// Delete a product
router.delete("/:id", async function (req, res, next) {
  let { id } = req.params;

  try {
    let product = await ProductSchema.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Success",
      error:[],
      data: product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Server Timeout",
      error:[],
      data: [],
    });
  }
});

// Get a product by ID 
router.get("/:id", async function (req, res, next) {
  let { id } = req.params;

  try {
    let product = await ProductSchema.findById(id);
    if (!product) {
      return res.status(400).send({
        success: false,
        message: "Product Not Found",
        error:[],
        data: [],
      });
    }
    res.status(200).send({
      success: false,
      message: "Success",
      error:[],
      data: product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Server Timeout",
      error:[],
      data: [],
    });
  }

});

module.exports = router;
