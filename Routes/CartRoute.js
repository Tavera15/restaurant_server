const express = require("express");
const router = express.Router();
const CartController = require("../Controllers/CartController");

router.post("/AddToCart", (req, res) => CartController.AddToCart(req, res));

module.exports = router;