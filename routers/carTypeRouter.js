const express = require("express");
const router = express.Router();
const carTypeController = require("../controllers/carTypeController");


router.post("/", carTypeController.createCarType); // create a car type
router.get("/", carTypeController.getAllCarTypes); // get all car types
router.get("/:id", carTypeController.getCarTypeById); // get a car type by id
router.put("/:id", carTypeController.updateCarType); // update a car type by id
router.delete("/:id", carTypeController.deleteCarType); // Delete a car type by id


module.exports = router;
