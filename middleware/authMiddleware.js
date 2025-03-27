const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
        console.log('Token:', token);
        console.log('JWT_SECRET:', process.env.JWT_SECRET);
        const decoded = jwt.verify(token.split(" ")[1],process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};
