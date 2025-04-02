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

// Get Product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("farmer", "name email");
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Error fetching product." });
    }
};

// Update Product
exports.updateProduct = async (req, res) => {
    try {
        const { name, price, quantity } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Verify product belongs to the farmer
        if (product.farmer.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized to update this product" });
        }

        product.name = name || product.name;
        product.price = price || product.price;
        product.quantity = quantity || product.quantity;

        if (req.file) {
            product.image = req.file.path;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: "Error updating product." });
    }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Verify product belongs to the farmer
        if (product.farmer.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized to delete this product" });
        }

        await product.deleteOne();
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting product." });
    }
};
