const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { generateTokens } = require('../middleware/jwtMiddleware');

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
        const saltRounds = parseInt(process.env.SALT, 10); 
        const hashedPassword = await bcrypt.hash(Passwd, saltRounds);

        // Create new user
        const newUser = new User({
            PhoneNumber,
            Email,
            UserName,
            Car: Car || [], 
            Passwd: hashedPassword, 
            Role: Role || 'User', 
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

//user login
exports.loginUser = async (req, res) => {
    try {
        const { Email, Passwd } = req.body;
        if(!Email || !Passwd) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        if (!Email.includes('@')) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(Passwd, user.Passwd);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate access token for the authenticated user
        const { accessToken } = generateTokens(user);

        res.json({ accessToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};