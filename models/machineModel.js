const mongoose = require("mongoose");
const { Schema } = mongoose;
const Station = require("./StationModel");

const machineSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      trim: true 
    },
    Station: {  
        type :  Schema.Types.ObjectId ,
        ref : 'Station',
        required: true,
    },
    Status: {
        type: String,
        enum: ['available', 'out of order', 'reserved'],
        default: "available"
    },
    Characteristic:{
        type: String,
        required: true,
        trim: true,
    },
    LastMaintenance: {
        type: Date,
        default: null
      },
    MaintenanceNotes: {
        type: String,
        trim: true
    },
  },
  { timestamps: true }
);

const Machine = mongoose.model("Machine", machineSchema);
module.exports = Machine;