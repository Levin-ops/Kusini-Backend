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

    const token = response.data.access_token;
    console.log("Token: ", token);

    req.mpesaToken = token;
    next();
  } catch (error) {
    console.error("Error fetching Mpesa token: ", error);
    res.status(400).json({ error: "Failed to generate token" });
  }
};

module.exports = { getMpesaToken };
