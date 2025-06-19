const express = require("express");
const router = express.Router()

const transactionController = require("../controllers/transaction");

router.get("/all", transactionController.getAll);
router.get("/category-count", transactionController.getCountByCategory);
router.get("/get/:catid/:sortid/:page/:limit", transactionController.getTransactions);
router.post("/add", transactionController.add);

module.exports = router
