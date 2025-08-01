
const jwt = require('jsonwebtoken');
const SECRET_KEY = "e48c461823ec94fd9b9f49996e0edb7bfa85ee66a8e86a3de9ce12cf0e657ac1";
const User = require('../model/Users');

function authorization(req, res, next) {
    const userId = req.cookies.userId;
    if (!userId) {
        return res.status(401).send({ "message": "Access denied. No userId cookie provided." });
    }
    User.findById(userId).then(userDoc => {
        if (!userDoc) {
            return res.status(401).send({ "message": "User not found." });
        }
        req.user = userDoc;
        next();
    }).catch(err => {
        return res.status(500).send({ "message": "Error fetching user.", error: err.message });
    });
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