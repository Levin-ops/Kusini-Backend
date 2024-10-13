const express = require("express");
const { getMpesaToken, stkPush } = require("../controller/mpesaController");

const router = express.Router();

router.post("/stkpush", getMpesaToken, stkPush);

module.exports = router;
