const axios = require("axios");

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

    req.mpesaToken = response.data.access_token;
    next();
  } catch (error) {
    console.error("Error fetching Mpesa token: ", error);
    res.status(400).json({ error: "Failed to generate token" });
  }
};

const stkPush = async (req, res) => {
  try {
    const phone = req.body.phone.substring(1);
    const amount = req.body.amount;
    const token = req.mpesaToken;

    const auth = `Bearer ${token}`;
    const shortCode = process.env.MPESA_SHORTCODE;
    const passKey = process.env.MPESA_PASSKEY;
    const timestamp = new Date().toISOString().replace(/-|T|:|\.\d+Z/g, "");

    const password = Buffer.from(`${shortCode}${passKey}${timestamp}`).toString(
      "base64"
    );

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerBuyGoodsOnline",
        Amount: amount,
        PartyA: `254${phone}`,
        PartyB: shortCode,
        PhoneNumber: `254${phone}`,
        CallBackURL: "https://mydomain.com/pet",
        AccountReference: "test",
        TransactionDesc: "Test Transaction",
      },
      {
        headers: { Authorization: auth },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("STK push error: ", error);
    res.status(500).json({ error: "Failed to process STK push" });
  }
};

module.exports = { getMpesaToken, stkPush };
