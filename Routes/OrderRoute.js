const express = require("express");
const router = express.Router();
const OrderController = require("../Controllers/OrderController");

router.post("/PlaceOrder", (req, res) => OrderController.PlaceOrder(req, res));

module.exports = router;