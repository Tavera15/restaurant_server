const express = require("express");
const router = express.Router();
const MenuItemController = require("../Controllers/MenuItemController");

router.get("/:name?", (req, res) => MenuItemController.GetMenuItems(req, res));
router.post("/NewMenuItem", (req, res) => MenuItemController.CreateMenuItem(req, res));
router.put("/UpdateMenuItem/:name", (req, res) => MenuItemController.UpdateMenuItem(req, res));
router.delete("/DeleteMenuItem/:name", (req, res) => MenuItemController.DeleteMenuItem(req, res));

module.exports = router;