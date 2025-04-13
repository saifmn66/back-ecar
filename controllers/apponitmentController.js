const Appointment = require("../models/appointmentModel");
const Machine = require("../models/machineModel");

// Check if a machine is available for given periods
exports.checkAvailability = async (req, res) => {
  try {
    const { machineId, date, startPeriod, endPeriod } = req.body;

    // Validate input
    if (!machineId || !date || !startPeriod || !endPeriod) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if machine exists
    const machine = await Machine.findById(machineId);
    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
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
      return res.status(409).json({ 
        available: false,
        message: "Machine is already booked for the selected periods",
        conflictingAppointment: existingAppointment
      });
    }

    res.status(200).json({
      available: true,
      message: "Machine is available for booking"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new appointment after checking availability
exports.addNewAppointment = async (req, res) => {
  try {
    const { stationId, machineId, userId, date, startPeriod, endPeriod } = req.body;

    // First check availability
    const availabilityResponse = await exports.checkAvailability({
      body: { machineId, date, startPeriod, endPeriod }
    }, { 
      json: (data) => data,
      status: () => ({ json: (data) => data }) 
    });

    if (!availabilityResponse.available) {
      return res.status(409).json(availabilityResponse);
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