import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  style: {
    type: String,
    default: 'default'
  },
});

export default mongoose.model('Image', ImageSchema);
