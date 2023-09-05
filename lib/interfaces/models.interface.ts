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
}

export interface UserInterface {
  email: string;
  name: string;
  role: 'user' | 'researcher' | 'admin';
  samples: Samples[]
  _id: string;
}