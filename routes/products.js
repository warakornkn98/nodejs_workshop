var express = require("express");
var router = express.Router();
var ProductSchema = require("../models/product.model.js");
var OrderSchema = require("../models/order.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenMiddleware = require("../middlewares/token.middleware.js");
const productMiddleware = require("../middlewares/product.middleware.js");

// Get all products
router.get("/",tokenMiddleware, async function (req, res, next) {
  try {
    
    let products = await ProductSchema.find({created_by: req.decoded.username});

    res.status(200).send({
      success: true,
      message: "Success",
      data: products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Server Timeout",
      data: [],
    });
  }
});

// Add a new product
router.post("/", tokenMiddleware, async function (req, res, next) {
  let { product_name, price, quantity } = req.body;
  let decoded = req.decoded;

  try {
    console.log("route add product");
    
    product = new ProductSchema({
      product_name,
      price,
      quantity,
      created_by: decoded.username,
    });

    await product.save();

    res.status(200).send({
      success: true,
      message: "Success",
      data: product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Server Timeout",
      data: [],
    });
  }
});

// Update a product
router.put("/:id",[tokenMiddleware,productMiddleware ], async function (req, res, next) {
  let { product_name, price, quantity } = req.body;
  let { id } = req.params;
  let decoded = req.decoded;

  try {
    // product = await ProductSchema.findOne({ _id: id });

    // if (product.created_by !== decoded.username) {
    //   return res.status(401).send({
    //     success: false,
    //     message: "unauthorized",
    //     error: [],
    //     data: [],
    //   });
    // }
    let product = req.product;
    product = await ProductSchema.findByIdAndUpdate(
      id,
      {
        product_name,
        price,
        quantity,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Success",
      data: product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Server Timeout",
      data: [],
    });
  }
});

// Delete a product
router.delete("/:id",[tokenMiddleware,productMiddleware ], async function (req, res, next) {
  let { id } = req.params;

  try {
    let product = await ProductSchema.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Success",
      data: product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Server Timeout",
      data: [],
    });
  }
});

// Get a product by ID
router.get("/:id",[tokenMiddleware,productMiddleware ], async function (req, res, next) {
  let { id } = req.params;

  try {
    let product = await ProductSchema.findById(id);
    if (!product) {
      return res.status(400).send({
        success: false,
        message: "Product Not Found",
        data: [],
      });
    }
    res.status(200).send({
      success: false,
      message: "Success",
      data: product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Server Timeout",
      data: [],
    });
  }
});

// add order to a product
router.post("/:id/orders",[tokenMiddleware,productMiddleware ], async function (req, res, next) {
  let { id } = req.params;
  let { amount } = req.body;

  try {
    // let product = await ProductSchema.findById(id);
    // if (!product) {
    //   return res.status(400).send({
    //     success: false,
    //     message: "Product Not Found",
    //     error: [],
    //     data: [],
    //   });
    // }
    console.log("route order to a product");
    
    let product = req.product;

    if (amount > product.quantity) {
      return res.status(400).send({
        success: false,
        message: "Not Enough Quantity",
        data: [],
      });
    }

    product = await ProductSchema.findByIdAndUpdate(id,{quantity: product.quantity - amount}, { new: true });

    let order = new OrderSchema({
      product_id: id,
      amount,
      Total_price: amount * product.price,
    });

    await order.save();

    // console.log("order", order);
    
    res.status(200).send({
      success: true,
      message: "Success",
      data: order,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Server Timeout",
      data: [],
    });
  }
});

// get orders of a product
router.get("/:id/orders",[ tokenMiddleware,productMiddleware ], async function (req, res, next) {
  let { id } = req.params;

  try {

    let orders = await OrderSchema.find({ product_id: id });
    
    res.status(200).send({
      success: true,
      message: "Success",
      data: orders,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Server Timeout",
      data: [],
    });
  }
});

// get all orders
router.get("/:id/orders",[ tokenMiddleware,productMiddleware ], async function (req, res, next) {
  let { id } = req.params;

  try {

    let orders = await OrderSchema.find({});
    
    res.status(200).send({
      success: true,
      message: "Success",
      data: orders,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Server Timeout",
      data: [],
    });
  }
});


module.exports = router;
