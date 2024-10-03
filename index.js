const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { type } = require("os");
const { error } = require("console");
const port = 4000;
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

app.use(express.json());
app.use(cors());

//Database connection with mongoBD
mongoose.connect(
  "mongodb+srv://levinmwanganyi:Shanazia2021!@cluster0.uivn7.mongodb.net/kusini"
);

app.get("/", (req, res) => {
  res.send("Express App is running.");
});

//Image Storage
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

//Creating Upload endpoint for images
app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

//Schema for products

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
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
});

//Toggling Product Availability
app.post("/toggleavailability", async (req, res) => {
  const { id } = req.body;
  let product = await Product.findOne({ id });

  if (!product) {
    return res.status(404).json({ success: false, error: "Product not found" });
  }
  product.available = !product.available;

  await product.save();
  res.json({ success: true, available: product.available });
});

//Deletion API
app.post("/deleteproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({
    success: true,
    name: req.body.name,
  });
});

//EndPoint for Getting Products API
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  res.send(products);
});

//Endpoint for Top-Shelf drinks
app.get("/topshelf", async (req, res) => {
  let products = await Product.find({ level: "Top Shelf" });
  let topShelf = products.slice(1).slice(-12);
  res.send(products);
});

//Endpoint for Popular Drinks
app.get("/populardrinks", async (req, res) => {
  let products = await Product.find({ level: "Standard" });
  let popularDrinks = products.slice(0, 8);
  res.send(popularDrinks);
});

//Schema For Admin Model
const Admin = mongoose.model("Admin", {
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//Admin Signup
app.post("/signup", async (req, res) => {
  let check = await Admin.findOne({ phone: req.body.phone });
  if (check) {
    return res.status(400).json({
      success: false,
      error: "Existing user found with similar number",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const admin = new Admin({
    name: req.body.name,
    phone: req.body.phone,
    password: hashedPassword,
  });

  await admin.save();

  const data = {
    admin: {
      id: admin.id,
    },
  };
  const token = jwt.sign(data, "secret-kusini");
  res.json({ success: true, token });
});

//Admin login
app.post("/login", async (req, res) => {
  let admin = await Admin.findOne({ phone: req.body.phone });
  if (admin) {
    const passCompare = await bcrypt.compare(req.body.password, admin.password); // Compare hashed password
    if (passCompare) {
      const data = {
        admin: {
          id: admin.id,
        },
      };
      const token = jwt.sign(data, "secret-kusini");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, error: "Wrong Password" });
    }
  } else {
    res.json({ success: false, error: "Wrong Phone Number" });
  }
});

// Order Schema
const OrderSchema = new mongoose.Schema({
  customer: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  items: [
    {
      productId: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
  ],
  paymentMethod: {
    type: String,
    enum: ["cod", "mpesa", "paynow"],
    required: true,
  },
  shippingFee: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
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

const Order = mongoose.model("Order", OrderSchema);

// Order Endpoints
app.get("/allorders", async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/createOrder", async (req, res) => {
  const { customer, items, paymentMethod, shippingFee, totalAmount } = req.body;

  if (!customer || !items || !paymentMethod || !totalAmount) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const newOrder = new Order({
    customer,
    items,
    paymentMethod,
    shippingFee,
    totalAmount,
  });

  try {
    const savedOrder = await newOrder.save();
    res.status(201).json({
      success: true,
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/updateOrderStatus", async (req, res) => {
  const { orderId, newStatus } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Deleting orders
app.post("/deleteorder", async (req, res) => {
  const { orderId } = req.body;

  try {
    await Order.findByIdAndDelete(orderId);
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// MPESA INTEGRATION
// Generating Token
const getMpesaToken = async (req, res, next) => {
  try {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const url =
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
      "base64"
    );

    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const token = response.data.access_token;
    console.log("Token: ", token);

    req.mpesaToken = token;
    next();
  } catch (error) {
    console.error("Error fetching Mpesa token: ", error);
    res.status(400).json({ error: "Failed to generate token" });
  }
};

// Token route
app.get("/token", getMpesaToken, (req, res) => {
  res.json({ message: "Token generated successfully", token: req.mpesaToken });
});

// Generating STK Push
app.post("/stk", getMpesaToken, async (req, res) => {
  try {
    const phone = req.body.phone.substring(1);
    const amount = req.body.amount;
    const passKey = process.env.MPESA_PASSKEY;
    const tillNumber = process.env.MPESA_SHORTCODE;
    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:\.Z]/g, "")
      .slice(0, 14);

    const password = Buffer.from(tillNumber + passKey + timestamp).toString(
      "base64"
    );

    const data = {
      BusinessShortCode: tillNumber,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerBuyGoodsOnline",
      Amount: amount,
      PartyA: `254${phone}`,
      PartyB: tillNumber,
      PhoneNumber: `254${phone}`,
      CallBackURL: "https://yourdomain.com/mpesa/callback",
      AccountReference: `Order12345`,
      TransactionDesc: "Payment for goods",
    };

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      data,
      {
        headers: {
          Authorization: `Bearer ${req.mpesaToken}`,
        },
      }
    );

    res.json({
      success: true,
      message: "STK Push request sent",
      response: response.data,
    });
  } catch (error) {
    console.error(
      "Error initiating STK Push: ",
      error.response ? error.response.data : error
    );
    res.status(400).json({ error: "Failed to initiate STK Push" });
  }
});

// Initializing API
app.listen(port, (error) => {
  if (!error) {
    console.log(`Server running on port ${port}`);
  } else {
    console.log("Error:", error);
  }
});
