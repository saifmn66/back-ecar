const express = require("express");
const router = express.Router();
const stationController = require("../controllers/stationController");


router.post("/", stationController.createStation);
router.post("/:stationId/addBooking", stationController.addBookedSlot);
router.post("/:stationId/addBlocked", stationController.addMaintenanceSlot);


module.exports = router;
