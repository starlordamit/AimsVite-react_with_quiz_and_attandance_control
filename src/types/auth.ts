import { User } from './user';

export interface LoginResponse {
  id: number;
  batch: number;
  email: string;
  mobile: string;
  name: string;
  pin: string;
  role: string;
  roll_number: string;
  section: string;
  semester: number;
  token: string;
  username: string;
  year: number;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}