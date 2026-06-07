export interface UserResponse {
  id: string;
  email: string;
  role: string;
  nim?: string | null;
  nama?: string | null;
  noHp?: string | null;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  role: string;
  nim?: string;
  nama: string;
  noHp?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface UpdateUserRequest {
  email?: string;
  nim?: string;
  nama?: string;
  noHp?: string;
}
