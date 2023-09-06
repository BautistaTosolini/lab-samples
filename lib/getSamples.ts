import axios, { AxiosError } from "axios";

import { UserInterface } from "./interfaces/models.interface";
import { API_BASE } from "@/constants";

interface SamplesResponse {
  user: UserInterface | null;
  error: AxiosError | null;
};

export const getSamples = async (currentPage: Number): Promise<SamplesResponse> => {
  try {
    const { data } = await axios.post(`${API_BASE}/api/samples`, { currentPage })

    return { user: data.user, error: null }

  } catch (e) {
    const error = e as AxiosError;

    return { user: null, error }
  }
};