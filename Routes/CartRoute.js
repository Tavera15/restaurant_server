const express = require("express");
const router = express.Router();
const CartController = require("../Controllers/CartController");

router.post("/AddToCart", (req, res) => CartController.AddToCart(req, res));
router.delete("/ClearCart", (req, res) => CartController.ClearCart(req, res));

module.exports = router;