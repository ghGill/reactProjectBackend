const express = require("express");
const router = express.Router()

const userController = require("../controllers/user");

router.get("/get", userController.getUserByToken)

module.exports = router
