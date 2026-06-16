import { executeHybridRequest, mockDB } from "../api-client";
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
      },
      () => {
        // Mock fallback behavior
        const mockToken = "mock-access-token-for-testing";
        mockDB.set<string>("token", mockToken);
        return {
          accessToken: mockToken
        };
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
      },
      () => {
        // Mock fallback behavior
        const newUser: UserResponse = {
          id: `user-${Date.now()}`,
          email: payload.email,
          role: payload.role,
          nim: payload.nim || null,
          nama: payload.nama,
          noHp: payload.noHp || null,
          gender: payload.gender || null,
          universitas: payload.universitas || null
        };
        const users = mockDB.get<UserResponse[]>("users", MOCK_USERS);
        users.push(newUser);
        mockDB.set("users", users);
        return newUser;
      }
    );
  },

  getMe: async () => {
    return executeHybridRequest<UserResponse>(
      "Get current user profile",
      API_ROUTES.IAM_ME,
      { 
        method: "GET" 
      },
      () => {
        // Mock fallback behavior
        const users = mockDB.get<UserResponse[]>("users", MOCK_USERS);
        return users[0]; // mock return the first user
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
      },
      () => {
        // Mock fallback behavior
        const users = mockDB.get<UserResponse[]>("users", MOCK_USERS);
        const updatedUser = { ...users[0], ...payload };
        return updatedUser as UserResponse;
      }
    );
  },

  logout: async () => {
    return executeHybridRequest(
      "Logout",
      API_ROUTES.IAM_LOGOUT,
      { method: "POST" },
      () => {
        mockDB.set("token", null);
        return { data: true, status: 200, message: "Logged out" };
      }
    );
  }
};
