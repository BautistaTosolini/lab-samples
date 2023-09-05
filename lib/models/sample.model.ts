import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const sampleModel = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  sampleType: {
    type: String,
    required: true,
  },
  observations: {
    type: String,
  },
  inclusion: {
    type: Boolean,
    required: true,
  },
  semithin: {
    type: Boolean,
    required: true,
  },
  thin: {
    type: Boolean,
    required: true,
  },
  grid: {
    type: Boolean,
    required: true,
  },
}, {
  timestamps: true
});

const Sample = mongoose.models.Sample || mongoose.model('Sample', sampleModel);

export default Sample;