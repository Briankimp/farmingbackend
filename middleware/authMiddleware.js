const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes middleware
exports.protect = async (req, res, next) => {
    try {
        // Get token from header
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ 
                message: "Access denied. Please log in to access this resource." 
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user from token
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return res.status(401).json({ 
                    message: "The user belonging to this token no longer exists." 
                });
            }

            // Check if user changed password after token was issued
            if (user.passwordChangedAt && decoded.iat < user.passwordChangedAt.getTime() / 1000) {
                return res.status(401).json({ 
                    message: "User recently changed password. Please log in again." 
                });
            }

            // Grant access to protected route
            req.user = user;
            next();
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({ 
                message: "Invalid token. Please log in again." 
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ 
            message: "Internal server error during authentication." 
        });
    }
};

// Vendor only middleware
exports.vendorOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ 
            message: "Please log in to access this resource." 
        });
    }

    if (req.user.role !== 'vendor') {
        return res.status(403).json({ 
            message: "Access denied. This resource is only available to vendors." 
        });
    }

    next();
};

// Farmer only middleware
exports.farmerOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ 
            message: "Please log in to access this resource." 
        });
    }

    if (req.user.role !== 'farmer') {
        return res.status(403).json({ 
            message: "Access denied. This resource is only available to farmers." 
        });
    }

    next();
};

// Check roles middleware (for routes accessible by multiple roles)
exports.checkRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                message: "Please log in to access this resource." 
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Access denied. This resource is only available to ${roles.join(' or ')}.` 
            });
        }

        next();
    };
};
