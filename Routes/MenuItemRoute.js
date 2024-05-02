const express = require("express");
const router = express.Router();
const MenuItemController = require("../Controllers/MenuItemController");
const verifyToken = require("../Middleware/Auth");

router.get("/:name?", (req, res) => MenuItemController.GetMenuItems(req, res));
router.post("/NewMenuItem", (req, res) => MenuItemController.CreateMenuItem(req, res));
router.put("/UpdateMenuItem/:name", verifyToken, (req, res) => MenuItemController.UpdateMenuItem(req, res));
router.delete("/DeleteMenuItem/:name", verifyToken, (req, res) => MenuItemController.DeleteMenuItem(req, res));

module.exports = router;