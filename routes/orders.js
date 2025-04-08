var express = require("express");
var router = express.Router();
var OrderSchema = require("../models/order.model.js");

router.get("/", async function (req, res, next) {
    try{
        let orders = await OrderSchema.find({});
        res.status(200).send({
            status: 200,
            message: "Success",
            data: orders,
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