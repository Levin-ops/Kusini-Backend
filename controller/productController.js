const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

const addProduct = async (req, res) => {
  try {
    let products = await Product.find({});
    let id = products.length > 0 ? products.slice(-1)[0].id + 1 : 1;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: 0, message: "No image file uploaded." });
    }

    // Use upload_stream with the buffer as in the original code
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      async (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ success: 0, message: "Cloudinary upload error", error });
        }

        const product = new Product({
          id: id,
          name: req.body.name,
          image: result.secure_url,
          code: req.body.code,
          category: req.body.category,
          description: req.body.description,
          level: req.body.level,
          price: req.body.price,
        });

        await product.save();

        res.json({
          success: 1,
          name: req.body.name,
        });
      }
    );

    const bufferStream = Readable.from(req.file.buffer);
    bufferStream.pipe(stream);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: 0, message: "Failed to add product." });
  }
};

const getAllProducts = async (req, res) => {
  try {
    let products = await Product.find({});
    res.send(products);
  } catch (error) {
    console.error("Error getting all products:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getCustomerProducts = async (req, res) => {
  try {
    let products = await Product.find({ available: true });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting customer products:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getRelatedProducts = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const relatedProducts = await Product.find({ category });

    if (!relatedProducts || relatedProducts.length === 0) {
      return res.status(404).json({ message: "No related products found" });
    }

    res.json(relatedProducts);
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const toggleAvailability = async (req, res) => {
  const { id } = req.body;
  let product = await Product.findOne({ id });

  if (!product) {
    return res.status(404).json({ success: false, error: "Product not found" });
  }
  product.available = !product.available;

  await product.save();
  res.json({ success: true, available: product.available });
};

const deleteProduct = async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({
    success: true,
    name: req.body.name,
  });
};

const getTopShelf = async (req, res) => {
  let products = await Product.find({ level: "Top Shelf" });
  let topShelf = products.slice(0, 16);
  res.send(topShelf);
};

const getPopularDrinks = async (req, res) => {
  let products = await Product.find({ level: "Standard" });
  let popularDrinks = products.slice(0, 16);
  res.send(popularDrinks);
};

const getSoftDrinks = async (req, res) => {
  let products = await Product.find({ category: "soft-drink" });
  let softDrinks = products.slice(0, 5);
  res.send(softDrinks);
};

module.exports = {
  addProduct,
  getAllProducts,
  getCustomerProducts,
  getRelatedProducts,
  toggleAvailability,
  deleteProduct,
  getTopShelf,
  getPopularDrinks,
  getSoftDrinks,
};
