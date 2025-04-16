const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/jwtMiddleware");
const router = express.Router();
const stationController = require("../controllers/stationController");

router.post("/create", verifyToken, verifyAdmin, stationController.createStation);
router.get("/", stationController.getAllStations);

module.exports = router;
