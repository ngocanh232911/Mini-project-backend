import express from 'express';
import Image from '../models/Image.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();
router.post('/save', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { prompt, imageUrl, style } = req.body;

    if (!prompt || !imageUrl) {
      return res.status(400).json({ error: 'Prompt and imageUrl are required' });
    }

    const newImage = new Image({
      userId,
      prompt,
      imageUrl,
      style: style || 'default',
    });

    await newImage.save();

    res.status(201).json({ message: 'Image saved successfully', image: newImage });
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/history', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const images = await Image.find({ userId }).sort({ createdAt: -1 });

    res.json(images);
  } catch (error) {
    console.error('Error getting history:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.delete('/delete/:id', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const imageId = req.params.id;
  
    try {
      const image = await Image.findOne({ _id: imageId, userId });
      if (!image) {
        return res.status(404).json({ error: 'Image not found or unauthorized' });
      }
  
      await Image.deleteOne({ _id: imageId });
      res.json({ message: 'Image deleted successfully' });
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

export default router;
