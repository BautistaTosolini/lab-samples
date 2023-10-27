import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const sampleModel = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
  },
  researcher: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  sampleType: {
    type: String,
    required: true,
  },
  observations: {
    type: String,
  },
  inclusion: {
    type: Boolean,
    default: false,
  },
  semithin: {
    type: Boolean,
    default: false,
  },
  thin: {
    type: Boolean,
    default: false,
  },
  grid: {
    type: Boolean,
    default: false,
  },
  finished: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

const Sample = mongoose.models.Sample || mongoose.model('Sample', sampleModel);

export default Sample;