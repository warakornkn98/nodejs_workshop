var express = require("express");
var router = express.Router();
var ProductSchema = require("../models/product.model.js");
var OrderSchema = require("../models/order.model.js");
var tokenMiddleware = require("../middlewares/token.middleware.js");

router.get("/", tokenMiddleware, async function (req, res, next) {
    try{
        const decoded = req.decoded;
        let products = await ProductSchema.find({created_by: decoded.username});
        let allOrders = [];
        for (let i = 0; i < products.length; i++){
            let orders = await OrderSchema.find({product_id: products[i].id});
            allOrders.push({
                product: products[i],
                orders: orders,
            });
        }

        res.status(200).send({
            status: 200,
            message: "Success",
            data: allOrders,
        });
    }catch(error){
        res.status(500).send({
            status: 500,
            message: "Server Timeout",
            data: null,
        });
    }
});

module.exports = router;