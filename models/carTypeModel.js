const mongoose = require("mongoose");
const { Schema } = mongoose;

const carTypeSchema = new Schema(
  {
    brand : {
      required : true ,
      type : String ,
    } , 
    model : {
      type : String , 
      required : true ,
    },
    image : {
      type : String , 
      required : true ,
    },
    batteryCapacity : {
      type : Number , 
      required : true ,
    },
    KWparKM :{
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const CarType = mongoose.model("carType", carTypeSchema);
module.exports = CarType;