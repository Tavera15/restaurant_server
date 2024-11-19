const express = require("express");
const router = express.Router();

const CategoryController = require("../Controllers/CategoryController");
const verifyToken = require("../Middleware/Auth");

router.get("/:name?", CategoryController.GetCategories);
router.post("/CreateCategory", verifyToken, (req, res) => CategoryController.CreateCategory(req, res));
router.put("/UpdateCategory/:name", verifyToken, (req, res) => CategoryController.UpdateCategory(req, res));
router.delete("/DeleteCategory/:name", verifyToken, CategoryController.DeleteCategory);

module.exports = router;