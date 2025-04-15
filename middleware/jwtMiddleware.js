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
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access token is required" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
};