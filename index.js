const express = require('express');
const mongoose = require('mongoose');
const carTypeRoutes = require('./routers/carTypeRouter');
const stationRoutes = require('./routers/stationRouter');
const userRoutes = require('./routers/userRouter');

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use('/cartype', carTypeRoutes);
app.use('/station', stationRoutes);
app.use('/user', userRoutes);

// MongoDB connection URI
const uri = "mongodb+srv://patosaif33:OHiDmi2yzEJ9L01F@ecars.jio9237.mongodb.net/ecars?retryWrites=true&w=majority";

// Connect to MongoDB using Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB via Mongoose!"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});