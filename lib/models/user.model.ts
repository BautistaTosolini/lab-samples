import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
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
    enum: ['user', 'researcher', 'admin'],
    default: 'user',
  },
  samples: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sample',
    }
  ],
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