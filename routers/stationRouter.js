const express = require("express");
const router = express.Router();
const stationController = require("../controllers/stationController");


router.post("/", stationController.createStation); 

module.exports = router;
