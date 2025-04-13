const mongoose = require("mongoose");
const { Schema } = mongoose;
const user = require("./userModel");

const stationSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      trim: true 
    },
    Position: {  
      Long: {    
        type: Number,
        required: true,
      },
      Lat: {     
        type: Number,
        required: true,
      }
    },
    City :{
      type: String,
      required: true,
    },
    Town :{
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Station = mongoose.model("Station", stationSchema);
module.exports = Station;