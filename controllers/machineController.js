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
    res
      .status(500)
      .json({ message: "Error creating machine", error: error.message });
  }
};


//get machine by id 
exports.getMachineById = async (req, res) => {
  try{
    const oneMachine = await Machine.findById(req.params.id);
    if(!oneMachine){
      return res.status(404).json({message: "Machine Not Found"});
    }
    res.status(200).json(oneMachine);

  }catch (error){
    console.error("Error fetching machine:", error);
    res.status(500).json({ message: "Error fetching machine", error: error.message });
  }
}


// Fetch all machines in a specific station
exports.getMachinesByStation = async (req, res) => {
  try {
    const { stationId } = req.params;

    const machines = await Machine.find({ Station: stationId });

    if (!machines || machines.length === 0) {
      return res
        .status(404)
        .json({ message: "No machines found for this station" });
    }

    res.status(200).json(machines);
  } catch (error) {
    console.error("Error fetching machines:", error);
    res.status(500).json({ message: "Error fetching machines", error: error.message });
  }
};

//update machine
exports.updateMachine = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedMachine = await Machine.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedMachine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    res.status(200).json({
      message: "Machine updated successfully",
      MAchine: updatedMachine,
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating machine", error });
  }
};

// Delete Machine
exports.deleteMachine = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the machine
    const deletedMachine = await Machine.findByIdAndDelete(id);

    if (!deletedMachine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    res.status(200).json({
      message: "Machine deleted successfully",
      machine: deletedMachine,
    });
  } catch (error) {
    console.error("Error deleting machine:", error); // Log the error for debugging
    res.status(500).json({ message: "Error deleting machine", error: error.message });
  }
};
