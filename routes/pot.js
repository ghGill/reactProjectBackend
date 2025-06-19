const express = require("express");
const router = express.Router()

const potController = require("../controllers/pot");

router.get("/all", potController.getAll);
router.post("/add", potController.add);
router.put("/update", potController.update);
router.delete("/delete", potController.delete);

module.exports = router
