const express = require("express");
const router = express.Router()

const userController = require("../controllers/user");

router.get("/get/:id", userController.getUserById)

module.exports = router
