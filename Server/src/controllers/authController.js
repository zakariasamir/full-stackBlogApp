const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Use consistent salt rounds (10)
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Registration - Hashed password:', hashedPassword);
    
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email });
    console.log('Raw password length:', password.length);

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    console.log('Found user:', { email: user.email, passwordHash: user.password });
    
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password comparison:', { 
        inputLength: password.length,
        hashLength: user.password.length,
        isMatch 
      });

      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, "your_jwt_secret", { expiresIn: "1h" });
      res.json({ token, user: { id: user._id, email: user.email, username: user.username } });
    } catch (bcryptError) {
      console.error('Bcrypt comparison error:', bcryptError);
      return res.status(500).json({ error: "Error verifying credentials" });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};
