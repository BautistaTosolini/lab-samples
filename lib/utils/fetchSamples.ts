import axios from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

import { API_BASE } from '@/constants';

import { Samples, UserInterface } from '@/lib/interfaces/models.interface';
import toast from 'react-hot-toast';

interface FetchDataParams {
  setUserInfo: Dispatch<SetStateAction<UserInterface | null>>;
  setSamples: Dispatch<SetStateAction<Samples[] | null>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  router: AppRouterInstance;
}

const fetchData = async ({ setUserInfo, setSamples, setIsLoading, router }: FetchDataParams) => {
  await axios.post(`${API_BASE}/api/samples`, { currentPage: 1 })
    .then((response) => {
      const user = response.data.user;
      const samples = response.data.user.samples;

      setUserInfo(user);
      setSamples(samples);

      if (!user) {
        router.push('/')
      }

      setIsLoading(false);
    })
    .catch((error) => {
      toast.error(error.response.data.message)
    })
};

export default fetchData;