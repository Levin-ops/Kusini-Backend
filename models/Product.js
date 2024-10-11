const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  id: Number,
  name: { type: String, required: true },
  code : { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  level: { type: String, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

module.exports = mongoose.model("Product", ProductSchema);
