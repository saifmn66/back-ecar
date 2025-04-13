const express = require("express");
const router = express.Router();
const carTypeController = require("../controllers/carTypeController");


router.post("/", carTypeController.createCarType);
router.get("/", carTypeController.getAllCarTypes);
router.get("/:id", carTypeController.getCarTypeById);


module.exports = router;
