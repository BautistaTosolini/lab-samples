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
  serviceName: string;
  serviceType: string;
  price: number;
  staining: boolean;
}

export interface UserInterface {
  email: string;
  name: string;
  id: string;
  lastname: string;
  role: 'researcher' | 'secretary' | 'admin';
  samples: Samples[];
  _id: string;
  createdAt: string;
  samplesCount: number;
}

export interface ServiceInterface {
  code: number;
  name: string;
  price: number;
}

export interface CustomError {
  response?: {
    data?: {
      message?: string;
    };
  };
}