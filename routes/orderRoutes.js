const express = require("express");
const {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controller/orderController");
const { getMpesaToken } = require("../middleware/mpesaMiddleware");
const { stkPush } = require("../controller/mpesaController");

const router = express.Router();

router.post("/stkpush", getMpesaToken, stkPush);
router.post("/createOrder", createOrder);
router.get("/allorders", getAllOrders);
router.post("/updateOrderStatus", updateOrderStatus);
router.post("/deleteorder", deleteOrder);

module.exports = router;
