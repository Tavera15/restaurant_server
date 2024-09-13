const express = require("express");
const router = express.Router();
const CartController = require("../Controllers/CartController");

router.post("/AddToCart", (req, res) => CartController.AddToCart(req, res));
router.put("/UpdateItem", (req, res) => CartController.UpdateItem(req, res));
router.delete("/DeleteItem", (req, res) => CartController.DeleteItem(req, res));
router.delete("/ClearCart", (req, res) => CartController.ClearCart(req, res));

module.exports = router;