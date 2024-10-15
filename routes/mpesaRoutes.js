const express = require("express");
const {
  getMpesaToken,
  stkPush,
  callback,
} = require("../controller/mpesaController");

const router = express.Router();

router.post("/stkpush", getMpesaToken, stkPush);
router.post("/callback", callback);

module.exports = router;
