import axios, { AxiosError } from 'axios';

import { UserInterface } from './interfaces/models.interface';

interface UserResponse {
  user: UserInterface | null;
  error: AxiosError | null;
};

export const getUser = async (): Promise<UserResponse> => {
  try {
    const { data } = await axios.get('/api/auth/authenticate')

    return { user: data.user, error: null }

  } catch (e) {
    const error = e as AxiosError;

    return { user: null, error }
  }
};