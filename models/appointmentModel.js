const mongoose = require("mongoose");
const { Schema } = mongoose;
const Station = require("../models/StationModel");
const Machine = require("../models/machineModel");
const User = require("../models/userModel");

const AppointmentSchema = new Schema(
  {
    Station: {
        type :  Schema.Types.ObjectId ,
        ref : 'Station',
        required: true,
    },
    Machine: {
        type :  Schema.Types.ObjectId ,
        ref : 'Machine',
        required: true,
    },
    User: {
        type :  Schema.Types.ObjectId ,
        ref : 'User',
        required: true,
    },
    StartPeriod: {
        type: Number,
        required: true,
        min: 1,
        max: 6,
        validate: {
          validator: Number.isInteger,
          message: '{VALUE} is not an integer!'
        }
      },
      EndPeriod: {
        type: Number,
        required: true,
        min: 1,
        max: 6,
        validate: {
          validator: Number.isInteger,
          message: '{VALUE} is not an integer!'
        }
      },
      AppointmentDate: {  
        type: Date,
        default: Date.now,
      }
    },
    { 
      timestamps: true,
      validate: {  
        validator: function() {
          return this.EndPeriod >= this.StartPeriod;
        },
        message: 'EndPeriod must be >= StartPeriod!'
      }
    }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;