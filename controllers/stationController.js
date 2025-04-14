const Station = require('../models/StationModel');

// create a new station
exports.createStation = async (req, res) => {
  try {
    const { Name, Position, City, Town } = req.body;

    // Validate required fields
    if (!Name || !City || !Town) {
      return res.status(400).json({ message: "Name, City, and Town are required fields" });
    }

    if (!Position || Position.Long === undefined || Position.Lat === undefined) {
      return res.status(400).json({ message: "Position with Long and Lat is required" });
    }

    const newStation = new Station({
      Name,
      Position: {
        Long: Number(Position.Long),
        Lat: Number(Position.Lat),
      },
      City,
      Town,
    });

    await newStation.save();
    res.status(201).json({
      message: "Station created successfully",
      station: newStation,
    });
  } catch (error) {
    console.error("Error creating station:", error);
    res.status(500).json({ message: "Error creating station", error: error.message });
  }
};

//get all Stations 
exports.getAllStations = async (req, res) => {
  try {
    const Stations = await Station.find().sort({ views: -1 });
    if (!Stations) {
      return res.status(400).json({ message: "No Stations found" });
    }
    res.status(200).json(Stations);
  } catch (error) {
    console.error("Error Fetching stations:", error);
    res.status(500).json({ message: "Error Fetching stations", error: error.message });
  }
};

//get Stations by town
exports.getStationsByTown = async (req, res) => {
  try {
    const { town } = req.params;

    const Stations = await Station.find({ Town: town }).sort({ views: -1 });

    if (!Stations || Stations.length === 0) {
      return res.status(404).json({ message: "No Stations found in the specified town" });
    }

    res.status(200).json(Stations);
  } catch (error) {
    console.error("Error Fetching stations:", error);
    res.status(500).json({ message: "Error Fetching stations", error: error.message });
  }
};

//get Stations by city
exports.getStationsByCity = async (req, res) => {
  try {
    const { town } = req.params;

    const Stations = await Station.find({ City: town }).sort({ views: -1 });

    if (!Stations || Stations.length === 0) {
      return res.status(404).json({ message: "No Stations found in the specified city" });
    }

    res.status(200).json(Stations);
  } catch (error) {
    console.error("Error Fetching stations:", error);
    res.status(500).json({ message: "Error Fetching stations", error: error.message });
  }
};


//get Stations by city and town
exports.getStationsByCity = async (req, res) => {
  try {
    const { city , town } = req.params;

    const Stations = await Station.find({ City: city  , Town: town}).sort({ views: -1 });

    if (!Stations || Stations.length === 0) {
      return res.status(404).json({ message: "No Stations found in the specified city" });
    }

    res.status(200).json(Stations);
  } catch (error) {
    console.error("Error Fetching stations:", error);
    res.status(500).json({ message: "Error Fetching stations", error: error.message });
  }
};