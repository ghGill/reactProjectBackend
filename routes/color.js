const express = require("express");
const router = express.Router()

const colorController = require("../controllers/color");

router.get("/all", colorController.getAll);

module.exports = router
