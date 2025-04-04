const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized");
  }
  let token = req.headers.authorization;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized",
        data: [],
      });
    }
    req.decoded = decoded;
    next();
  });
  console.log("tokenmiddleware");

};
