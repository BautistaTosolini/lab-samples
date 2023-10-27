export interface Samples {
  code: string;
  date: Date,
  researcher: UserInterface,
  assignedTo: UserInterface[],
  sampleType: string,
  observations: string,
  inclusion: boolean,
  semithin: boolean,
  thin: boolean,
  grid: boolean,
  finished: boolean,
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserInterface {
  email: string;
  name: string;
  lastname: string;
  role: 'researcher' | 'secretary' | 'admin';
  samples: Samples[];
  _id: string;
  createdAt: string;
  samplesCount: number;
}

export interface CustomError {
  response?: {
    data?: {
      message?: string;
    };
  };
}