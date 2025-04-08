var express = require("express");
var router = express.Router();
const multer = require('multer');
var ProductSchema = require("../models/product.model.js");
var OrderSchema = require("../models/order.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenMiddleware = require("../middlewares/token.middleware.js");
const productMiddleware = require("../middlewares/product.middleware.js");



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + '_' + file.originalname)
  }
})
const upload = multer({ storage: storage })

// Get all products
router.get("/",tokenMiddleware, async function (req, res, next) {

  try {
    
    let products = await ProductSchema.find({created_by: req.decoded.username});

    res.status(200).send({
      status: 200,
      message: "Success",
      data: products,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Server Timeout",
      data: null,
    });
  }
});

// Add a new product
router.post("/", [tokenMiddleware,upload.single("image")], async function (req, res, next) {
  let { product_name, price, quantity } = req.body;
  let decoded = req.decoded;
  const image = req.file ? req.file.filename : null;

  try {
    // console.log("route add product");
    
    product = new ProductSchema({
      product_name,
      price,
      image,
      quantity,
      created_by: decoded.username,
    });

    await product.save();

    res.status(200).send({
      status: 200,
      message: "Inserted Successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Server Timeout",
      data: null,
    });
  }
});

// Update a product
router.put("/:id",[tokenMiddleware,productMiddleware,upload.single("image") ], async function (req, res, next) {
  let { product_name, price, quantity } = req.body;
  let { id } = req.params;
  let decoded = req.decoded;
  let image = req.file ? req.file.filename : null;

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
        image: req.file ? req.file.filename : product.image,
        price,
        quantity,
      },
      { new: true }
    );

    res.status(200).send({
      status: 200,
      message: "Updated Successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Server Timeout",
      data: null,
    });
  }
});

// Delete a product
router.delete("/:id",[tokenMiddleware,productMiddleware ], async function (req, res, next) {
  let { id } = req.params;

  try {
    let product = await ProductSchema.findByIdAndDelete(id);

    res.status(200).send({
      status: 200,
      message: "Deleted Successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Server Timeout",
      data: null,
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
        status: 400,
        message: "Product Not Found",
        data: [],
      });
    }
    res.status(200).send({
      status: 200,
      message: "Success",
      data: product,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Server Timeout",
      data: null,
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
        status: 400,
        message: "Not Enough Quantity",
        data: null,
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
      status: 200,
      message: "Success",
      data: order,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Server Timeout",
      data: null,
    });
  }
});

// get orders of a product
router.get("/:id/orders",[ tokenMiddleware,productMiddleware ], async function (req, res, next) {
  let { id } = req.params;

  try {

    let orders = await OrderSchema.find({ product_id: id });
    
    res.status(200).send({
      status: 200,
      message: "Success",
      data: orders,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Server Timeout",
      data: null,
    });
  }
});

// get all orders
router.get("/:id/orders",[ tokenMiddleware,productMiddleware ], async function (req, res, next) {
  let { id } = req.params;

  try {

    let orders = await OrderSchema.find({});
    
    res.status(200).send({
      status: 200,
      message: "Success",
      data: orders,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Server Timeout",
      data: null,
    });
  }
});


module.exports = router;
