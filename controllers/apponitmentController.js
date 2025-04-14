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
  