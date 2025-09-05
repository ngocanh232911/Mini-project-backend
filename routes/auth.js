import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';  


const router = express.Router();


router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || username.length < 3 || /\s/.test(username)) {
    return res.status(400).json({ error: 'Username must be at least 3 characters and contain no spaces.' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  if (!/[0-9!@#$%^&*]/.test(password)) {
    return res.status(400).json({ error: 'Password must contain at least one number or special character.' });
  }


  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'Exist username!' });

    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.json({ message: 'Register Successfully!' });
  } catch (err) {
    res.status(500).json({ error: ' Server error' });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid username or password' });

    const token = jwt.sign({ id: user._id }, 'a9f4e1e9e90a7b12dc8c7fadb3e54c11cc0a6c1e99d9b39a4e764a3725b1a52c', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Lỗi cụ thể:', err);
    res.status(500).json({ error: 'Chi tiết lỗi: ' + err.message });    
  }
});

export default router;
