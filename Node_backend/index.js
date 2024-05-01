const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/Pi_esprit', { useNewUrlParser: true, useUnifiedTopology: true });
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },  // Changed from Buffer to String for simplicity
    role: { type: String, default: 'user' }
  });
const User = mongoose.model('User', UserSchema);
// Schema for storing gas data
const gasSchema = new mongoose.Schema({
  gasType: String,
  concentration: Number,
  location: {
    lat: Number,
    lng: Number,
  },
});

const Gas = mongoose.model('Gas', gasSchema);

// Route to fetch gas data
app.get('/api/gas-data', async (req, res) => {
  try {
    const data = await Gas.find();
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/api/forgot-password', async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password must be provided' });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found with this email' });
      }
  
      // Update user's password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password has been successfully reset' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({'message': 'Error missing email or password'});
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({'message': 'User already exists'});
    }
    
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());
    const newUser = new User({ email, password: hashedPassword });
    
    try {
      const savedUser = await newUser.save();
      res.status(200).json({'message': `Successfully created user with ID ${savedUser._id}`});
    } catch (e) {
      res.status(400).json({'message': `Error creating user: ${e}`});
    }
  });

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ 'message': 'Email and password must be strings' });
    }
  
    try {
      const user = await User.findOne({ email }).exec();
      if (!user) {
        return res.status(404).json({ 'message': 'User not found' });
      }
      const hashedPassword = user.password instanceof Buffer ? user.password.toString() : user.password;
  
      const isMatch = await bcrypt.compare(password, hashedPassword);
      if (isMatch) {
        res.status(200).json({
          'message': 'Login successful',
          'user': {
            'role': user.role, // Send the user's role
            'email': user.email
          }
        });
      } else {
        res.status(401).json({ 'message': 'Invalid email or password' });
      }
    } catch (e) {
      res.status(500).json({ 'error': e.message });
    }
  });

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});