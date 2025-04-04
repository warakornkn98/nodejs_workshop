var express = require("express");
var router = express.Router();
var ProductSchema = require("../models/product.model.js");
var OrderSchema = require("../models/order.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenMiddleware = require("../middlewares/token.middleware.js");
const productMiddleware = require("../middlewares/product.middleware.js");

router.get("/", async function (req, res, next) {
    try{
        let orders = await OrderSchema.find({});
        res.status(200).send({
            success: true,
            message: "Success",
            data: orders,
        });
    }catch(error){
        res.status(500).send({
            success: false,
            message: "Server Timeout",
            data: [],
        });
    }
});

module.exports = router;