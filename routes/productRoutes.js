const express = require("express");
const {
  addProduct,
  getAllProducts,
  toggleAvailability,
  deleteProduct,
  getTopShelf,
  getPopularDrinks,
  getSoftDrinks,
} = require("../controller/productController");
const { upload } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/addproduct", upload.single("product"), addProduct);
router.post("/toggleavailability", toggleAvailability);
router.post("/deleteproduct", deleteProduct);
router.get("/allproducts", getAllProducts);
router.get("/topshelf", getTopShelf);
router.get("/populardrinks", getPopularDrinks);
router.get("/softdrinks", getSoftDrinks);

module.exports = router;
