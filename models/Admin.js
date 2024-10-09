const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, unique: true, required: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Admin", AdminSchema);
