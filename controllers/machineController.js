const Machine = require("../models/machineModel");

// Add a new machine
exports.addNewMachine = async (req, res) => {
  try {
    const { Name, Station, Characteristic } = req.body;

    if (!Name || !Station || !Characteristic) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newMachine = new Machine({
      Name,
      Station,
      Characteristic,
    });

    await newMachine.save();
    res.status(201).json({
      message: "Machine created successfully",
      machine: newMachine,
    });
  } catch (error) {
    console.error("Error creating machine:", error);
    res.status(500).json({ message: "Error creating machine", error: error.message });
  }
};

// Fetch all machines in a specific station
exports.getMachinesByStation = async (req, res) => {
  try {
    const { stationId } = req.params;

    const machines = await Machine.find({ Station: stationId });

    if (!machines || machines.length === 0) {
      return res.status(404).json({ message: "No machines found for this station" });
    }

    res.status(200).json(machines);
  } catch (error) {
    console.error("Error fetching machines:", error);
    res.status(500).json({ message: "Error fetching machines", error: error.message });
  }
};