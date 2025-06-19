const express = require("express");
const router = express.Router()

const overviewController = require("../controllers/overview");

router.get("/all", overviewController.getAll)

module.exports = router
