const Station = require('../models/StationModel');

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


