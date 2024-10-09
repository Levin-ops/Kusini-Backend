const axios = require("axios");
const shortid = require("shortid");

const stkPush = async (req, res) => {
  const { phone, amount } = req.body; // Phone number and amount to be charged
  const token = req.mpesaToken; // This is passed via middleware

  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

  const auth = `Bearer ${token}`;

  try {
    const response = await axios.post(
      url,
      {
        BusinessShortCode: process.env.MPESA_BUSINESS_SHORTCODE,
        Password: Buffer.from(
          `${process.env.MPESA_BUSINESS_SHORTCODE}${
            process.env.MPESA_PASSKEY
          }${new Date().toISOString().replace(/-|T|:|\.\d+Z/g, "")}`
        ).toString("base64"),
        Timestamp: new Date().toISOString().replace(/-|T|:|\.\d+Z/g, ""),
        TransactionType: "CustomerBuyGoodsOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.MPESA_BUSINESS_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: process.env.CALLBACK_URL,
        AccountReference: shortid.generate(),
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

module.exports = { stkPush };
