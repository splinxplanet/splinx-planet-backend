const jwt = require("jsonwebtoken");
const keys = process.env.JWT_SECRET;

// Generate JWT token
const authenticationToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized User. Pls Login" });
    }

    jwt.verify(token, keys, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }
        req.user = user;
        next();
    });
}

module.exports = authenticationToken;