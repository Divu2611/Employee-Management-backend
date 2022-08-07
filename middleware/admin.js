const config = require('config');

function admin(req, res, next) {
    if (!config.get('authReq')) {
        return next();
    }

    try {
        if (!req.employee.isAdmin) {
            return res.status(403).send("Forbidden...");
        }
        next();
    } catch (exception) {
        return res.send(400).send("Access Denied... Invalid Token...");
    }
}

exports.admin = admin