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
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserInterface {
  email: string;
  name: string;
  lastname: string;
  role: 'researcher' | 'secretary';
  samples: Samples[];
  _id: string;
  createdAt: string;
}

export interface CustomError {
  response?: {
    data?: {
      message?: string;
    };
  };
}