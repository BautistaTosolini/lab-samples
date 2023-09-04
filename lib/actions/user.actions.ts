'use server'

import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/user.model';

interface RegisterUserParams {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async ({ name, email, password }: RegisterUserParams) => {
  try {
    connectToDB();
    
    const isEmailTaken = await User.findOne({ email });

    if (isEmailTaken) {
      return 'El E-Mail ya fue tomado';
    }

    const user = await User.create({
      name,
      email,
      password,
    })

    if (user) {
      
    }

  } catch (error) {
    
  }
};