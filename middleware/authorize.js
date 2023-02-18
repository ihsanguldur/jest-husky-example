const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        if(typeof req.headers.authorization === "undefined") {
            return res.status(401).json({err: "unauthorized"});
        }
        const parsedToken = req.headers.authorization.split(" ");

        let token;
        if(parsedToken.length === 2) {
            token = parsedToken[1];
        } else {
            token = parsedToken[0];
        }

        jwt.verify(token, 'private', function(err, decoded) {
            if(err) {
                return res.status(401).json({err: err});
            }

            req.TOKEN = decoded;
        });
        next();
    } catch (e) {
        console.log(e);
        return res.status(500).json({err: e});
    }

}
