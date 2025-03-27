const Product = require("../models/Product");

exports.uploadProduct = async (req, res) => {
    try {
        const { name, price, quantity } = req.body;

        // Check if an image was uploaded
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const image = req.file.path;

        // Create a new product
        const product = new Product({
            name,
            price,
            quantity,
            image,
            farmer: req.user.id
        });

        await product.save();
        res.status(201).json({ message: "Product uploaded successfully!", product });

    } catch (error) {
        res.status(500).json({ error: "Error uploading product.", details: error.message });
    }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("farmer", "name email");
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error fetching products." });
    }
};

// Get Farmer's Products
exports.getFarmerProducts = async (req, res) => {
    try {
        const products = await Product.find({ farmer: req.user.id });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error fetching farmer's products." });
    }
};
