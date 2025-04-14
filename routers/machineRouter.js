const express = require("express");
const router = express.Router();
const machineController = require("../controllers/machineController");


router.post("/", machineController.addNewMachine); //add new machine
router.get("/:id/one/", machineController.getMachineById); //get one machine by id
router.get("/:idStation/", machineController.getMachinesByStation); // get machines by station id
router.put("/:id/", machineController.updateMachine); //update machine by id 
router.delete("/:id/", machineController.deleteMachine); //delete machine by id


module.exports = router;
