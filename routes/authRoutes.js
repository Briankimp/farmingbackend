const express = require("express");
const { register, login } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", protect, (req, res) => {
    res.json({
        message: `Welcome ${req.user.name}!`,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
});

module.exports = router;
