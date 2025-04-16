const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config()

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

// Generate an access token
exports.generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.Role },
    SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { accessToken };
};

// Verify access tokens
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
  if (!token) {
    return res.status(401).json({ message: "Access token is required" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = decoded; // Attach decoded token data to the request
    next();
  });
};

// Middleware to check if the user has the admin role
exports.verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};