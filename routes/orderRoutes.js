const express = require("express");
const {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controller/orderController");

const router = express.Router();

router.post("/createOrder", createOrder);
router.get("/allorders", getAllOrders);
router.post("/updateOrderStatus", updateOrderStatus);
router.post("/deleteorder", deleteOrder);

module.exports = router;
