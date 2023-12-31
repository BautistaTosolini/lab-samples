import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
  },
  lastname: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['researcher', 'secretary', 'admin'],
    default: 'researcher',
  },
  samples: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sample',
    }
  ],
  samplesCount: {
    type: Number,
    default: 0,
  },
  recoveryToken: {
    type: String,
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  const user = this;

  user.email = user.email.toLowerCase();

  if (!user.isModified('password')) {
    next();
  };

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error: any) {
    return next(error)
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;