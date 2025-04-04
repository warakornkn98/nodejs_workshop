const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    try{
        let token = req.headers.authorization
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send(err);
            }
            req.decoded = decoded;
        });
        console.log("tokenmiddleware");
        
        next()
    }catch(error){
        next(error);
    }

}