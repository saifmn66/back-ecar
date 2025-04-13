const CarType = require('../models/carTypeModel');

// Create a new car type
exports.createCarType = async (req, res) => {
  try {
    const { brand, model, image, batteryCapacity, KWparKM } = req.body;

    // Validate required fields
    if (!brand || !model || !image || !batteryCapacity || !KWparKM) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newCarType = new CarType({
      brand,
      model,
      image,
      batteryCapacity,
      KWparKM,
    });

    await newCarType.save();
    res.status(201).json({
      message: "Car type created successfully",
      carType: newCarType,
    });
  } catch (error) {
    console.error("Error creating car type:", error);
    res.status(400).json({ message: "Error creating car type", error: error.message });
  }
};

// Get all car types
exports.getAllCarTypes = async (req, res) => {
  try {
    const cars = await CarType.find().sort({ views: -1 }); // Removed unnecessary populate
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching car types", error });
  }
};

// Get a car type by ID
exports.getCarTypeById = async (req, res) => {
  try {
    const car = await CarType.findById(req.params.id); // Removed unnecessary populate
    if (!car) {
      return res.status(404).json({ message: "Car type not found" });
    }

    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: "Error fetching car type", error });
  }
};

// Update a car type by ID
exports.updateCarType = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCarType = await CarType.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCarType) {
      return res.status(404).json({ message: "Car type not found" });
    }

    res.status(200).json({
      message: "Car type updated successfully",
      carType: updatedCarType,
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating car type", error });
  }
};

// Delete a car type by ID
exports.deleteCarType = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCarType = await CarType.findByIdAndDelete(id);

    if (!deletedCarType) {
      return res.status(404).json({ message: "Car type not found" });
    }

    res.status(200).json({ message: "Car type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting car type", error });
  }
};



