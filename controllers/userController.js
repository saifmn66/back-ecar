const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
    try {
        const { PhoneNumber, Email, UserName, Car, Passwd, Role } = req.body;

        // Validate required fields
        if (!PhoneNumber || !Email || !UserName || !Passwd) {
            return res.status(400).json({ message: "Phone number, email, username, and password are required" });
        }

        // Validate car information if provided
        if (Car && (!Array.isArray(Car) || Car.some(car => !car.carModel || !car.CarId || !car.SerialNumber))) {
            return res.status(400).json({ message: "Each car must have carModel, CarId, and SerialNumber" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ Email }, { PhoneNumber }] });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email or phone number already exists" });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(Passwd, saltRounds);

        // Create new user
        const newUser = new User({
            PhoneNumber,
            Email,
            UserName,
            Car: Car || [], // Default to an empty array if no cars are provided
            Passwd: hashedPassword, // Store the hashed password
            Role: Role || 'User', // Default role is 'User'
        });

        await newUser.save();

        // Return response without password
        const userResponse = newUser.toObject();
        delete userResponse.Passwd;

        res.status(201).json({
            message: "User created successfully",
            user: userResponse,
        });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ 
            message: "Server error while creating user", 
            error: error.message 
        });
    }
};