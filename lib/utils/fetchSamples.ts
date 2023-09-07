import axios from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import toast from 'react-hot-toast';

import { Samples, UserInterface } from '@/lib/interfaces/models.interface';

interface FetchDataParams {
  setUserInfo: Dispatch<SetStateAction<UserInterface | null>>;
  setSamples: Dispatch<SetStateAction<Samples[] | null>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  router: AppRouterInstance;
}

const fetchData = async ({ setUserInfo, setSamples, setIsLoading, router }: FetchDataParams) => {
  await axios.post(`/api/samples`, { currentPage: 1 })
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