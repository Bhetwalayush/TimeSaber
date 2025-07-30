
const jwt = require('jsonwebtoken');
const SECRET_KEY = "e48c461823ec94fd9b9f49996e0edb7bfa85ee66a8e86a3de9ce12cf0e657ac1";
const User = require('../model/Users');

function authorization(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(401).send({ "message": "Access denied. No token provided." });
    }
    try {
        const verified = jwt.verify(token, SECRET_KEY);
        // Fetch full user document for audit logging
        User.findById(verified.userId).then(userDoc => {
            if (!userDoc) {
                return res.status(401).send({ "message": "User not found." });
            }
            req.user = userDoc;
            next();
        }).catch(err => {
            return res.status(500).send({ "message": "Error fetching user.", error: err.message });
        });
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