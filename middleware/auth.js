const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {

    if (!config.get('authReq')) {
        return next();
    }

    const authToken = req.header("x-authToken");
    if (!authToken) {
        return res.status(401).send("Access Denied... No Token Authorized");
    }

    try {
        const decodedPayload = jwt.verify(authToken, config.get('jwtPrivateKey'));
        req.employee = decodedPayload;
        next();
    } catch (exception) {
        return res.status(400).send("Access Denied... Invalid Token");
    }
}

exports.auth = auth;