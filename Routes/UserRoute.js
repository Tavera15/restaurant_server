const express = require("express");
const router = express.Router();

const UserController = require("../Controllers/UserController");

router.post("/CreateUser", (req, res) => UserController.CreateUser(req, res));
router.put("/UpdateUser", (req, res) => UserController.UpdateUser(req, res));
router.put("/UpdatePassword", (req, res) => UserController.UpdatePassword(req, res));

module.exports = router;