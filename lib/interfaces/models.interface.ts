export interface Samples {
  code: string;
  date: Date,
  author: UserInterface,
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
  role: 'user' | 'researcher' | 'admin';
  samples: Samples[]
  _id: string;
}

export interface CustomError {
  response?: {
    data?: {
      message?: string;
    };
  };
}