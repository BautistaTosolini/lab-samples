import axios, { AxiosError } from "axios";

import { UserInterface } from "./interfaces/models.interface";

interface SamplesResponse {
  user: UserInterface | null;
  error: AxiosError | null;
};

export const getSamples = async (currentPage: Number): Promise<SamplesResponse> => {
  try {
    const { data } = await axios.post(`/api/samples`, { currentPage })

    return { user: data.user, error: null }

  } catch (e) {
    const error = e as AxiosError;

    return { user: null, error }
  }
};