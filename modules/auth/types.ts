export interface User {
  id: string;
  name: string;
  nim?: string;
  nidn?: string;
  email: string;
  role: "mahasiswa" | "mentor" | "super-admin";
  university?: string;
  program?: string;
  company?: string;
  title?: string;
  phone?: string;
  avatarColor?: string;
  period?: string;
}

export interface AuthSession {
  user: User | null;
  token: string | null;
}

export interface LoginRequest {
  email: string;
  role: "mahasiswa" | "mentor" | "super-admin";
}

export interface RegisterRequest {
  name: string;
  email: string;
  role: "mahasiswa" | "mentor" | "super-admin";
  nim?: string;
  nidn?: string;
  university?: string;
  program?: string;
  noHp?: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
  university?: string;
  program?: string;
  company?: string;
  period?: string;
  nim?: string;
}
