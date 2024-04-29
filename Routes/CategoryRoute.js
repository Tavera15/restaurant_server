const express = require("express");
const CategoryController = require("../Controllers/CategoryController");

const router = express.Router();

router.get("/", CategoryController.GetCategories);

module.exports = router;