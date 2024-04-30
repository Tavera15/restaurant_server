const express = require("express");
const router = express.Router();

const CategoryController = require("../Controllers/CategoryController");

router.get("/:name?", CategoryController.GetCategories);
router.post("/CreateCategory", (req, res) => CategoryController.CreateCategory(req, res));
router.put("/UpdateCategory/:name", (req, res) => CategoryController.UpdateCategory(req, res));
router.delete("/DeleteCategory/:name", CategoryController.DeleteCategory);

module.exports = router;