const express = require("express");
const router = express.Router()

const categoryController = require("../controllers/category");

router.get("/all", categoryController.getAll);

module.exports = router
