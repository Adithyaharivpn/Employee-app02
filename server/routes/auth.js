const router = require('express').Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Store password directly as plain text
    const newUser = new User({
      username,
      password: password, 
      role: role || 'user'
    });

    const savedUser = await newUser.save();
    res.json({ _id: savedUser._id, username: savedUser.username, role: savedUser.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare plain text password
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ msg: "Login Successful", user: { _id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
