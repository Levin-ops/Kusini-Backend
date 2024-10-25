const Order = require("../models/Order");
const { emitNewOrder } = require("../socket");
// const twilio = require("twilio");
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = new twilio(accountSid, authToken);

const createOrder = async (req, res) => {
  const { customer, items, paymentMethod, shippingFee, totalAmount, location } =
    req.body;

  if (!customer || !items || !paymentMethod || !totalAmount || !location) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const newOrder = new Order({
    customer,
    items,
    paymentMethod,
    paymentStatus: paymentMethod === "cod" ? "C.O.D" : "M.O.D",
    shippingFee,
    totalAmount,
    location,
  });

  try {
    const savedOrder = await newOrder.save();

    emitNewOrder();

    res.status(201).json({
      success: true,
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateOrderStatus = async (req, res) => {
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

    // // twilio
    // const twilio_number = "+19165426990";
    // if (newStatus === "Delivered") {
    //   client.messages
    //     .create({
    //       body: `Hello ${updatedOrder.customer.firstName},  your order has been delivered. Thank You for shopping at Kusini Liquor`,
    //       to: `+254${updatedOrder.customer.phoneNumber.slice(1)}`,
    //       from: twilio_number,
    //     })
    //     .then((message) => console.log(`sms sent: ${messages.sid}`))
    //     .catch((err) => console.error("failed to send sms:", err));
    // }

    res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteOrder = async (req, res) => {
  const { orderId } = req.body;

  try {
    await Order.findByIdAndDelete(orderId);
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const checkPaymentStatus = async (req, res) => {
  const { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required." });
  }

  try {
    const order = await Order.findOne({ "customer.phoneNumber": phoneNumber })
      .sort({ createdAt: -1 }) // Get the latest order by this phone number
      .exec();

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json({
      success: true,
      paymentStatus: order.paymentStatus,
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrder,
  checkPaymentStatus,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};
