const Product = require("../models/Product");

// Upload a new product
exports.uploadProduct = async (req, res) => {
    try {
        const { name, price, quantity } = req.body;

        if (!name || !price || !quantity) {
            return res.status(400).json({ message: "Name, price, and quantity are required." });
        }

        const newProduct = new Product({
            name,
            price: Number(price),
            quantity: Number(quantity),
            farmer: req.user._id
        });

        if (req.file) {
            newProduct.image = req.file.path;
        }

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Upload Product Error:", error);
        res.status(500).json({ message: "Server error while uploading product." });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('farmer', 'name email')
            .sort('-createdAt');
        res.status(200).json(products);
    } catch (error) {
        console.error("Get All Products Error:", error);
        res.status(500).json({ message: "Server error while fetching products." });
    }
};

// Get products by farmer
exports.getFarmerProducts = async (req, res) => {
    try {
        const products = await Product.find({ farmer: req.user._id })
            .sort('-createdAt');
        res.status(200).json(products);
    } catch (error) {
        console.error("Get Farmer Products Error:", error);
        res.status(500).json({ message: "Server error while fetching farmer's products." });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId)
            .populate('farmer', 'name email');

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Get Product By ID Error:", error);
        res.status(500).json({ message: "Server error while fetching product." });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        if (product.farmer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this product." });
        }

        const { name, price, quantity } = req.body;
        if (name) product.name = name;
        if (price) product.price = Number(price);
        if (quantity) product.quantity = Number(quantity);
        if (req.file) product.image = req.file.path;

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Update Product Error:", error);
        res.status(500).json({ message: "Server error while updating product." });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        if (product.farmer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this product." });
        }

        await product.deleteOne();
        res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
        console.error("Delete Product Error:", error);
        res.status(500).json({ message: "Server error while deleting product." });
    }
};
