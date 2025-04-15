const Appointment = require("../models/appointmentModel");
const Machine = require("../models/machineModel");

const checkMachineAvailability = async (machineId, date, startPeriod, endPeriod) => {
  // Check if machine exists
  const machine = await Machine.findById(machineId);
  if (!machine) {
    throw new Error("Machine not found");
  }

  // Check for overlapping appointments
  const existingAppointment = await Appointment.findOne({
    Machine: machineId,
    AppointmentDate: new Date(date),
    $or: [
      { StartPeriod: { $lte: endPeriod }, EndPeriod: { $gte: startPeriod } }
    ]
  });

  if (existingAppointment) {
    return {
      available: false,
      message: "Machine is already booked for the selected periods",
      conflictingAppointment: existingAppointment
    };
  }

  return { available: true, message: "Machine is available for booking" };
};

// Check if a machine is available for given periods
exports.checkAvailability = async (req, res) => {
  try {
    const { machineId, date, startPeriod, endPeriod } = req.body;

    // Validate input
    if (!machineId || !date || !startPeriod || !endPeriod) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const availability = await checkMachineAvailability(machineId, date, startPeriod, endPeriod);
      res.status(200).json(availability);
    } catch (error) {
      if (error.message === "Machine not found") {
        return res.status(404).json({ message: error.message });
      }
      throw error;
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new appointment after checking availability
exports.addNewAppointment = async (req, res) => {
  try {
    const { stationId, machineId, userId, date, startPeriod, endPeriod } = req.body;

    // First check availability
    const availability = await checkMachineAvailability(machineId, date, startPeriod, endPeriod);

    if (!availability.available) {
      return res.status(409).json(availability);
    }

    // Create new appointment
    const newAppointment = new Appointment({
      Station: stationId,
      Machine: machineId,
      User: userId,
      AppointmentDate: date,
      StartPeriod: startPeriod,
      EndPeriod: endPeriod
    });

    await newAppointment.save();

    // Update machine status if needed
    await Machine.findByIdAndUpdate(machineId, { Status: "reserved" });

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// to fetch free places in front
exports.checkAvailablePlaces = async (req, res) => {
    try {
      const { machineId, date } = req.body;
  
      // Validate input
      if (!machineId || !date) {
        return res.status(400).json({ message: "Machine ID and date are required" });
      }
  
      // Check if machine exists
      const machine = await Machine.findById(machineId);
      if (!machine) {
        return res.status(404).json({ message: "Machine not found" });
      }
  
      // Get all appointments for this machine/date
      const appointments = await Appointment.find({
        Machine: machineId,
        AppointmentDate: new Date(date)
      });
  
      // Initialize all periods as available (true)
      const availability = Array(6).fill(true);
  
      // Mark booked periods as false
      appointments.forEach(app => {
        for (let i = app.StartPeriod - 1; i < app.EndPeriod; i++) {
          if (i >= 0 && i < 6) availability[i] = false;
        }
      });
  
      res.status(200).json({
        availability, // Example: [true, true, false, false, true, false]
        message: `Availability for machine ${machineId} on ${date}`
      });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // cancel an appointment
  exports.cancelAppointment = async (req , res) => {
    try{
      const {idAppointment} = req.params;
      const canceledAppointment = await Appointment.findByIdAndDelete(idAppointment);
      if(!canceledAppointment){
        return res.status(404).json({message: "cant find the appointment"});
      }
      res.status(200).json({message: "appointment canceled successfully"});


    }catch(error){
      res.status(500).json({message: "Error deleting appointment", error});
    };
  }


  // get all appointments by user
  exports.getAllAppointmentsByUser = async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const appointments = await Appointment.find({ User: userId, AppointmentDate: { $gt: new Date() } }).populate("Machine").populate("Station");

      if (!appointments || appointments.length === 0) {
        return res.status(404).json({ message: "No appointments found for this user" });
      }

      res.status(200).json(appointments);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
  // get all appointments by machine for admin
  exports.getAllAppointmentsByMachine = async (req, res) => {
    try {
      const { machineId } = req.params;

      if (!machineId) {
        return res.status(400).json({ message: "Machine ID is required" });
      }

      const appointments = await Appointment.find({ Machine: machineId, AppointmentDate: { $gt: new Date() } }).populate("User").populate("Station");

      if (!appointments || appointments.length === 0) {
        return res.status(404).json({ message: "No appointments found for this machine" });
      }

      res.status(200).json(appointments);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };