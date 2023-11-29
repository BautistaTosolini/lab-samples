import mongoose from 'mongoose';

const serviceModel = new mongoose.Schema({
  code: { 
    type: Number, 
    required: true,
    unique: true,
  },
  name: { 
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['processing', 'staining'],
    required: true
  },
  price: {
    type: Number,
    default: 0,
  },
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceModel);

export default Service;