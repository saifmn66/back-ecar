const express = require('express');
const mongoose = require('mongoose');
const carTypeRoutes = require('./routers/carTypeRouter');
const stationRoutes = require('./routers/stationRouter');
const userRoutes = require('./routers/userRouter');
const appointmentRoutes = require('./routers/appointmentRouter');
const machineRoutes = require('./routers/machineRouter');

const app = express();
const dotenv = require('dotenv')
dotenv.config()

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use('/cartype', carTypeRoutes);
app.use('/station', stationRoutes);
app.use('/user', userRoutes);
app.use('/appointment', appointmentRoutes);
app.use('/machines', machineRoutes);

// MongoDB connection URI
const uri = process.env.MONGODB_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB via Mongoose!"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Define the port from the .env file or use a default value
const port = process.env.PORT;

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});