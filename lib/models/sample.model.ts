import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { string } from 'zod';

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
  },
  semithin: {
    type: Boolean,
  },
  thin: {
    type: Boolean,
  },
  grid: {
    type: Boolean,
  },
  staining: {
    type: Boolean,
  },
  finished: {
    type: Boolean,
    default: false,
  },
  serviceName: {
    type: String,
    required: true,
  },
  serviceType: {
    type: String,
    enum: ['processing', 'staining'],
    required: true
  },
  price: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true
});

const Sample = mongoose.models.Sample || mongoose.model('Sample', sampleModel);

export default Sample;