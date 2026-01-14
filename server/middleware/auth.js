// Middleware to check if user info is passed in headers (Simulated Auth)
// Since we removed JWT, we will rely on client sending 'x-role' or just trust for this demo,
// BUT to satisfy "user with valid credentials", we can check if the user exists in DB based on an ID sent.
// For simplicity as requested ("simple app"), we might just rely on the frontend State,
// but let's keep a basic check using a custom header 'user-id' to fetch user role.

const User = require('../models/User');

const verifyUser = async (req, res, next) => {
  const userId = req.header('x-user-id');
  if (!userId) return res.status(401).json({ message: 'Access Denied: No User ID' });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: 'Access Denied: Invalid User' });
    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid User ID' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access Denied: Admins Only' });
  }
  next();
};

module.exports = { verifyUser, isAdmin };
