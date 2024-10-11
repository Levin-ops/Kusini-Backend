const axios = require("axios");
const Order = require("../models/Order");

const formatPhoneNumber = (phone) => {
  // Check if the phone number starts with '0' and replace with '254'
  if (phone.startsWith("0")) {
    return phone.replace(/^0/, "254");
  }
  return phone; // If it already has 254, return as is
};

const stkPush = async (req, res) => {
  let { phone, amount } = req.body;
  const token = req.mpesaToken;

  // Format the phone number to match Mpesa requirements
  phone = formatPhoneNumber(phone);

  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
  const auth = `Bearer ${token}`;

  try {
    const response = await axios.post(
      url,
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: Buffer.from(
          `${process.env.MPESA_SHORTCODE}${
            process.env.MPESA_PASSKEY
          }${new Date().toISOString().replace(/-|T|:|\.\d+Z/g, "")}`
        ).toString("base64"),
        Timestamp: new Date().toISOString().replace(/-|T|:|\.\d+Z/g, ""),
        TransactionType: "CustomerBuyGoodsOnline",
        Amount: amount,
        PartyA: phone, // Use the formatted phone number
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone, // Use the formatted phone number
        CallBackURL: process.env.CALLBACK_URL,
        AccountReference: "Order Payment",
        TransactionDesc: "Payment for Order",
      },
      {
        headers: { Authorization: auth },
      }
    );

    if (response.data.ResponseCode === "0") {
      res.status(200).json({
        success: true,
        message:
          "STK Push initiated. Please complete the transaction on your phone.",
        MerchantRequestID: response.data.MerchantRequestID,
        CheckoutRequestID: response.data.CheckoutRequestID,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to initiate STK Push",
        error: response.data,
      });
    }
  } catch (error) {
    console.error("Error in STK Push:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

const handleMpesaCallback = async (req, res) => {
  try {
    const callbackData = req.body;
    const { Body } = callbackData;

    if (Body.stkCallback.ResultCode === 0) {
      // Successful transaction
      const transactionDetails = Body.stkCallback.CallbackMetadata.Item;
      const phoneNumber = transactionDetails.find(
        (item) => item.Name === "PhoneNumber"
      ).Value;
      const amountPaid = transactionDetails.find(
        (item) => item.Name === "Amount"
      ).Value;

      // Find the order by phone number and update it to PAID
      const order = await Order.findOne({
        "customer.phoneNumber": phoneNumber,
        paymentMethod: "mpesa",
      });

      if (order) {
        order.paymentStatus = "PAID";
        await order.save();
        return res
          .status(200)
          .json({ success: true, message: "Payment status updated to PAID." });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Order not found." });
      }
    } else {
      // Transaction failed or canceled
      return res
        .status(400)
        .json({ success: false, message: "Transaction failed." });
    }
  } catch (error) {
    console.error("Mpesa callback error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { stkPush, handleMpesaCallback };
