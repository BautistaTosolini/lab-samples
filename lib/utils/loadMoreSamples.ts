import axios from 'axios';
import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';

import { API_BASE } from '@/constants';

import { Samples } from '@/lib/interfaces/models.interface';

interface LoadMoreSamplesParams {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  scrollEnabled: boolean;
  setScrollEnabled: Dispatch<SetStateAction<boolean>>;
  samples: Samples[] | null;
  setSamples: Dispatch<SetStateAction<Samples[] | null>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}

const loadMoreSamples = ({ isLoading, setIsLoading, scrollEnabled, setScrollEnabled, samples, setSamples, page, setPage }: LoadMoreSamplesParams) => {
  if (scrollEnabled && window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 && !isLoading) {
    setIsLoading(true);
    setScrollEnabled(false);

    setTimeout(async () => {
      await axios.post(`${API_BASE}/api/samples`, { page })
        .then((response) => {
          const newSamples = response.data.user.samples;

          if (samples && newSamples.length > 0) {
            setSamples([...samples, ...newSamples || []]);
            setPage(page + 1);

            setIsLoading(false);
            setScrollEnabled(true);
          } else {
            setIsLoading(false);
            setScrollEnabled(false);
          }

        })
        .catch((error) => {
          toast.error(error.response.data.message)
        })
    }, 300);
  }
};

export default loadMoreSamples;