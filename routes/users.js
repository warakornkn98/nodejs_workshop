var express = require("express");
var router = express.Router();
var UserSchema = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenMiddleware = require("../middlewares/token.middleware.js");
require("dotenv").config();
const JWT_secret = process.env.JWT_secret

// Get all users
// router.get("/", async function (req, res, next) {
//   try {
//     let users = await UserSchema.find({});

//     res.status(200).send({
//       status: 200,
//       message: "Success",
//       data: users,
//     });
//   } catch (error) {
//     res.status(500).send({
//       status: 500,
//       message: "Server Timeout",
//       data: [],
//     });
//   }
// });

// Resister a new user
router.post("/register", async function (req, res, next) {
  let { username, password } = req.body;

  try {

    let user = await UserSchema.findOne({ username });
    
    if(user) {
      return res.status(400).send({
        status: 400,
        message: "User Already Exists",
        data: null,
      });
    }

    user = new UserSchema({
      username,
      password: bcrypt.hashSync(password, 10),
    });

    await user.save();

    res.status(201).send({
      status: 201,
      message: "registered successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Server Timeout",
      data: null,
    });
  }
});

// Login user
router.post("/login", async function (req, res, next) {
  let { username, password } = req.body;

  try {
    let user = await UserSchema.findOne({ username });

    if (!user) {
      return res.status(400).send({
        status: 400,
        message: "User Not Found",
        data: null,
      });
    }

    if (user.role == null) {
      return res.status(401).send({
        status: 401,
        message: "User Not Approved",
        data: null,
      });
    }

    if (bcrypt.compareSync(password, user.password) === false) {
      return res.status(401).send({
        status: 401,
        message: "Invalid Password",
        data: null,
      });
    }

    const token = jwt.sign(
      { username: user.username, role: user.role },
      JWT_secret,
      { expiresIn: "24h" }
    );

    res.status(200).send({
      status: 200,
      message: "Login Success",
      data: {username: user.username,token: token},
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Server Timeout",
      data: null,
    });
  }
});

// Approve user
router.put("/users/:id/approve",tokenMiddleware, async function (req, res, next) {
  let { role } = req.body;
  let { id } = req.params;
  let decode = req.decoded;
  try {
    if (decode.role !== "admin") {
      return res.status(401).send({
        status: 401,
        message: "Unauthorized",
        data: null,
      });
    }

    let user = await UserSchema.findByIdAndUpdate(id, { role }, { new: true });

    res.status(200).send({
      status: 200,
      message: "Approved Successfully",
      data: user,
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
