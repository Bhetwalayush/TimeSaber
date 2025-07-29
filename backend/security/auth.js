
const jwt = require('jsonwebtoken');
const SECRET_KEY = "e48c461823ec94fd9b9f49996e0edb7bfa85ee66a8e86a3de9ce12cf0e657ac1";

function authorization(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(401).send({ "message": "Access denied. No token provided." });
    }
    try {
        const verified = jwt.verify(token, SECRET_KEY)
        req.user = verified;
        next()
    } catch (ex) {
        return res.status(400).send({ "message": "Invalid token." });
    }
}

function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).send("Access Denied:Insufficient Permissions")
        }

        next();
    }
}
module.exports = { authorization, authorizeRole }