const express = require("express");
const router = express.Router();
const OrderController = require("../Controllers/OrderController");

router.get("/", (req, res) => OrderController.GetOrders(req, res));
router.post("/PlaceOrder", (req, res) => OrderController.PlaceOrder(req, res));

module.exports = router;