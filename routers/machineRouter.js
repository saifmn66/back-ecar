const express = require("express");
const router = express.Router();
const machineController = require("../controllers/machineController");


router.post("/", machineController.addNewMachine);
router.post("/:idStation/", machineController.getMachinesByStation);


module.exports = router;
