const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");
const mpesaRoutes = require("./routes/mpesaRoutes");
const http = require("http");
const { initSocket } = require("./socket");

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
app.use("/mpesa", mpesaRoutes);

const server = http.createServer(app);
initSocket(server);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
