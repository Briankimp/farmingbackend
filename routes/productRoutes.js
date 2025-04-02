const express = require("express");
const router = express.Router();
const {
    uploadProduct,
    getAllProducts,
    getFarmerProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

// Debugging to check if the functions are properly imported
console.log("uploadProduct:", typeof uploadProduct);
console.log("getAllProducts:", typeof getAllProducts);
console.log("getFarmerProducts:", typeof getFarmerProducts);
console.log("getProductById:", typeof getProductById);
console.log("updateProduct:", typeof updateProduct);
console.log("deleteProduct:", typeof deleteProduct);

if (
    !uploadProduct ||
    !getAllProducts ||
    !getFarmerProducts ||
    !getProductById ||
    !updateProduct ||
    !deleteProduct
) {
    throw new Error("❌ One or more product controllers are missing or undefined!");
}

// Routes
router.post("/upload", uploadProduct);
router.get("/all", getAllProducts);
router.get("/farmer/:farmerId", getFarmerProducts);
router.get("/:productId", getProductById);
router.put("/update/:productId", updateProduct);
router.delete("/delete/:productId", deleteProduct);

module.exports = router;
