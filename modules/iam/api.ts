import { executeHybridRequest } from "../api-client";
import { API_ROUTES } from "../api-routes";
import { RegisterRequest, LoginRequest, LoginResponse, UserResponse, UpdateUserRequest } from "./types";

const MOCK_USERS: UserResponse[] = [
  {
    id: "mock-1",
    email: "budi@student.ui.ac.id",
    role: "mahasiswa",
    nim: "2201012001",
    nama: "Budi Santoso",
    noHp: "081298765432",
    gender: "Laki-laki",
    universitas: "Universitas Indonesia"
  }
];

export const iamAPI = {
  login: async (payload: LoginRequest) => {
    return executeHybridRequest<LoginResponse>(
      `Login as ${payload.email}`,
      API_ROUTES.IAM_LOGIN,
      {
        method: "POST",
        body: JSON.stringify(payload)
      }
    );
  },

  register: async (payload: RegisterRequest) => {
    return executeHybridRequest<UserResponse>(
      `Register user: ${payload.nama}`,
      API_ROUTES.IAM_REGISTER,
      {
        method: "POST",
        body: JSON.stringify(payload)
      }
    );
  },

  getMe: async () => {
    return executeHybridRequest<UserResponse>(
      "Get current user profile",
      API_ROUTES.IAM_ME,
      { 
        method: "GET" 
      }
    );
  },

  updateProfile: async (payload: UpdateUserRequest) => {
    return executeHybridRequest<UserResponse>(
      "Update profile",
      API_ROUTES.IAM_UPDATE,
      {
        method: "PUT",
        body: JSON.stringify(payload)
      }
    );
  },

  logout: async () => {
    return executeHybridRequest(
      "Logout",
      API_ROUTES.IAM_LOGOUT,
      { method: "POST" }
    );
  },

  toggleActiveStatus: async (userId: string | number) => {
    return executeHybridRequest(
      `Toggle active status for user ${userId}`,
      API_ROUTES.IAM_TOGGLE_ACTIVE(userId),
      { method: "PUT" }
    );
  }
};
