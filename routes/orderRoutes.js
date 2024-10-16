const express = require("express");
const {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  checkPaymentStatus,
} = require("../controller/orderController");

const router = express.Router();

router.post("/createOrder", createOrder);
router.get("/allorders", getAllOrders);
router.post("/updateOrderStatus", updateOrderStatus);
router.post("/deleteorder", deleteOrder);
router.post("/checkPaymentStatus", checkPaymentStatus);
module.exports = router;
