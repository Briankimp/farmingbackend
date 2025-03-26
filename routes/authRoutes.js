const express = require("express");
const { register, login } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile",authMiddleware,(req,res) => {
    res.json({message:`Welcome, ${req.user.role}!`,userId:req.user.id});
});

module.exports = router;
