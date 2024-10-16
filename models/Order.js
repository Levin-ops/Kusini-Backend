const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    firstName: String,
    lastName: String,
    phoneNumber: String, // Make sure to capture the customer's phone number
  },
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      quantity: Number,
      price: Number,
      total: Number,
    },
  ],
  paymentMethod: {
    type: String,
    enum: ["cod", "mpesa", "paynow"],
  },
  paymentStatus: {
    type: String,
    enum: ["C.O.D", "M.O.D", "PAID", "PENDING"],
    default: "PENDING",
  },
  shippingFee: Number,
  totalAmount: Number,
  location: String,
  status: {
    type: String,
    enum: ["Pending", "Delivered", "Cancelled"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
