const { jwtDecode } = require("jwt-decode");

module.exports = function(req, res, next) {
    try{
        let token = req.headers.authorization
        const decoded = jwtDecode(token);
        console.log(decoded);
        req.decoded = decoded;
        next()
    }catch(error){
        res.status(401).send(error)
    }

}