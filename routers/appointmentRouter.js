const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/apponitmentController");


router.post("/", appointmentController.addNewAppointment);


module.exports = router;
