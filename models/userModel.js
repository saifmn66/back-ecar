const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    PhoneNumber : {
      type :  String ,
      required: true,
      validate: {
        validator: function(v) {
          return /^\d{10,15}$/.test(v); // Basic phone number validation
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    } , 
    Email : {
      type : String , 
      required : true ,
      validate: {
        validator: function(v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email validation
        },
        message: props => `${props.value} is not a valid email!`
      }
    },
    UserName : {
      type : String , 
      required : true ,
    },
    Car : [{
        carModel : {
            type :  Schema.Types.ObjectId ,
            ref : 'carType',
            required: true,
          } , 
          CarId : {
            type : String , 
            required : true ,
          },
          SerialNumber : {
            type : String , 
            required : true ,
          },
          battery : {
            type : Number , 
            required : true ,
            default : 100,
          }
    }],
    Passwd: {
        type: String,
        required: true,
    },
    Role: {
      type: String,
      enum: ['Admin', 'User'],
      default: 'User',
  },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;