import { executeHybridRequest, mockDB } from "../api-client";
import { User, LoginRequest, RegisterRequest, ProfileUpdateRequest } from "./types";

const DEFAULT_USERS: User[] = [
  {
    id: "stud-1",
    name: "Budi Santoso",
    nim: "2201012001",
    email: "budi.santoso@student.ui.ac.id",
    role: "mahasiswa",
    university: "Universitas Indonesia",
    program: "S1 Teknik Informatika",
    company: "PT. Global Teknologi Nusantara",
    title: "Software Engineering Intern",
    phone: "+62 812-9876-5432",
    avatarColor: "from-blue-500 to-indigo-500",
    period: "1 Februari 2026 - 31 Juli 2026",
  },
  {
    id: "ment-1",
    name: "Dr. Ahmad Hidayat, M.T.",
    nidn: "0423127801",
    email: "ahmad.hidayat@lecturer.ac.id",
    role: "mentor",
    company: "PT. Global Teknologi Nusantara",
    title: "Lead Software Architect & Senior Mentor",
    phone: "+62 856-1122-3344",
    avatarColor: "from-purple-500 to-indigo-500",
  },
  {
    id: "admin-1",
    name: "Super Administrator InternFlow",
    email: "admin@internflow.id",
    role: "super-admin",
    company: "InternFlow HQ Indonesia",
    phone: "+62 811-9988-7766",
    avatarColor: "from-rose-500 to-orange-500",
  }
];

// Helper to format Spring Boot response to Frontend UI models
function mapBackendUserToFrontend(backendUser: any): User {
  const roleMap: Record<string, "mahasiswa" | "mentor" | "super-admin"> = {
    "MAHASISWA": "mahasiswa",
    "MENTOR": "mentor",
    "SUPER ADMIN": "super-admin"
  };

  return {
    id: backendUser.id,
    name: backendUser.nama || "User",
    nim: backendUser.nim,
    email: backendUser.email,
    role: roleMap[backendUser.role?.toUpperCase()] || "mahasiswa",
    university: backendUser.universitas || "Universitas Indonesia",
    program: "S1 Teknik Informatika",
    company: "PT. Global Teknologi Nusantara",
    title: backendUser.role === "Mentor" ? "Mentor Lapangan" : "Software Engineering Intern",
    phone: backendUser.noHp,
    avatarColor: "from-blue-500 to-indigo-500",
    period: "1 Februari 2026 - 31 Juli 2026"
  };
}

export const authAPI = {
  login: async (payload: LoginRequest) => {
    return executeHybridRequest(
      `Login as ${payload.email}`,
      "/api/iam/login",
      {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: "securepassword123" // Seed password for seamless fullstack testing
        })
      },
      () => {
        const users = mockDB.get<User[]>("users", DEFAULT_USERS);
        const matched = users.find(
          (u) => u.email.toLowerCase() === payload.email.toLowerCase() && u.role === payload.role
        );

        if (!matched) {
          throw new Error("Kombinasi Email dan Role tidak ditemukan. Silakan daftarkan akun baru.");
        }

        mockDB.set<User | null>("current_user", matched);
        mockDB.set<string | null>("token", `mock-jwt-token-for-${matched.id}`);
        if (typeof window !== "undefined") {
          localStorage.setItem("internflow_token", `mock-jwt-token-for-${matched.id}`);
        }

        return {
          user: matched,
          token: `mock-jwt-token-for-${matched.id}`
        };
      }
    ).then((res) => {
      // If we are in real mode, save the real token and map the response user info
      if (res.message.includes("Real")) {
        const backendData = res.data as any;
        if (typeof window !== "undefined" && backendData.token) {
          localStorage.setItem("internflow_token", backendData.token);
        }
        return {
          ...res,
          data: {
            token: backendData.token,
            user: {
              id: "user-" + Date.now(),
              email: backendData.email,
              role: (backendData.role?.toLowerCase() === "super admin" ? "super-admin" : backendData.role?.toLowerCase()) as any,
              name: backendData.nama || "User"
            } as User
          }
        };
      }
      return res;
    });
  },

  register: async (payload: RegisterRequest) => {
    const roleLabelMap: Record<string, string> = {
      "mahasiswa": "Mahasiswa",
      "mentor": "Mentor",
      "super-admin": "Super Admin"
    };

    return executeHybridRequest(
      `Register user: ${payload.name}`,
      "/api/iam/register",
      {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: "securepassword123",
          role: roleLabelMap[payload.role] || "Mahasiswa",
          nim: payload.nim,
          nama: payload.name,
          noHp: payload.noHp || "081234567890"
        })
      },
      () => {
        const users = mockDB.get<User[]>("users", DEFAULT_USERS);
        const exists = users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase());

        if (exists) {
          throw new Error("Email sudah terdaftar. Silakan gunakan email lain atau masuk.");
        }

        const newUser: User = {
          id: `user-${Date.now()}`,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          nim: payload.nim,
          nidn: payload.nidn,
          university: payload.university || "Universitas Indonesia",
          program: payload.program || "S1 Teknik Informatika",
          avatarColor: "from-blue-500 to-indigo-500",
          company: "PT. Global Teknologi Nusantara",
          title: "Software Engineering Intern",
          period: "1 Februari 2026 - 31 Juli 2026",
        };

        users.push(newUser);
        mockDB.set<User[]>("users", users);
        mockDB.set<User | null>("current_user", newUser);
        mockDB.set<string | null>("token", `mock-jwt-token-for-${newUser.id}`);
        if (typeof window !== "undefined") {
          localStorage.setItem("internflow_token", `mock-jwt-token-for-${newUser.id}`);
        }

        return {
          user: newUser,
          token: `mock-jwt-token-for-${newUser.id}`
        };
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        const backendUser = res.data as any;
        return {
          ...res,
          data: {
            user: mapBackendUserToFrontend(backendUser),
            token: typeof window !== "undefined" ? localStorage.getItem("internflow_token") : null
          }
        };
      }
      return res;
    });
  },

  getCurrentUser: async () => {
    return executeHybridRequest<User>(
      "Get current authenticated user",
      "/api/iam/me",
      {
        method: "GET"
      },
      () => {
        const currentUser = mockDB.get<User | null>("current_user", null);
        const token = mockDB.get<string | null>("token", null);

        if (!token || !currentUser) {
          const defaultUsers = mockDB.get<User[]>("users", DEFAULT_USERS);
          const budi = defaultUsers.find(u => u.nim === "2201012001") || defaultUsers[0];
          mockDB.set<User | null>("current_user", budi);
          mockDB.set<string | null>("token", `mock-jwt-token-for-${budi.id}`);
          if (typeof window !== "undefined") {
            localStorage.setItem("internflow_token", `mock-jwt-token-for-${budi.id}`);
          }
          return budi;
        }
        return currentUser;
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        return {
          ...res,
          data: mapBackendUserToFrontend(res.data)
        };
      }
      return res;
    });
  },

  updateProfile: async (payload: ProfileUpdateRequest) => {
    return executeHybridRequest<User>(
      "Update current user profile",
      "/api/iam/update",
      {
        method: "PUT",
        body: JSON.stringify({
          email: payload.email,
          nim: payload.nim,
          nama: payload.name,
          noHp: payload.phone
        })
      },
      () => {
        const currentUser = mockDB.get<User | null>("current_user", null);
        if (!currentUser) {
          throw new Error("Sesi login tidak valid. Silakan login kembali.");
        }

        const updatedUser: User = {
          ...currentUser,
          ...payload
        };

        mockDB.set<User | null>("current_user", updatedUser);
        
        const users = mockDB.get<User[]>("users", DEFAULT_USERS);
        const index = users.findIndex(u => u.id === currentUser.id);
        if (index !== -1) {
          users[index] = updatedUser;
          mockDB.set<User[]>("users", users);
        }

        return updatedUser;
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        return {
          ...res,
          data: mapBackendUserToFrontend(res.data)
        };
      }
      return res;
    });
  },

  logout: async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("internflow_token");
    }
    mockDB.set<User | null>("current_user", null);
    mockDB.set<string | null>("token", null);
    return {
      data: true,
      status: 200,
      message: "Logout Success",
      timestamp: new Date().toISOString()
    };
  }
};
