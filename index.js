const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Kusini Backend is running...");
});

app.use("/admin", adminRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
