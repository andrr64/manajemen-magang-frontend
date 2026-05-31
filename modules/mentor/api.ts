import { simulateAPIRequest, mockDB } from "../api-client";
import { Mentor, CreateMentorRequest, UpdateMentorRequest } from "./types";

const INITIAL_MENTORS: Mentor[] = [
  {
    id: 1,
    name: "Dr. Ahmad Hidayat, M.T.",
    type: "Akademik",
    identityNo: "0423127801",
    email: "ahmad.hidayat@lecturer.ac.id",
    phone: "0812-3456-7890",
    departmentOrCompany: "Fakultas Ilmu Komputer (FASILKOM)",
    studentsCount: 8,
    status: "Aktif"
  },
  {
    id: 2,
    name: "Dr. Rina Astuti, S.Kom., M.MSI.",
    type: "Akademik",
    identityNo: "0412088502",
    email: "rina.astuti@lecturer.ac.id",
    phone: "0813-9876-5432",
    departmentOrCompany: "Fakultas Ilmu Komputer (FASILKOM)",
    studentsCount: 6,
    status: "Aktif"
  },
  {
    id: 3,
    name: "Hendra Wijaya, Ph.D.",
    type: "Akademik",
    identityNo: "0319078103",
    email: "hendra.wijaya@lecturer.ac.id",
    phone: "0857-1122-3344",
    departmentOrCompany: "Fakultas Teknik (FT)",
    studentsCount: 5,
    status: "Aktif"
  },
  {
    id: 4,
    name: "Denny Siregar, S.T.",
    type: "Industri",
    identityNo: "GTN-88012",
    email: "denny.siregar@globaltech.co.id",
    phone: "0821-4455-6677",
    departmentOrCompany: "PT. Global Teknologi Nusantara",
    studentsCount: 4,
    status: "Aktif"
  },
  {
    id: 5,
    name: "Jessica Alba, M.B.A.",
    type: "Industri",
    identityNo: "SHP-0992",
    email: "jessica.alba@shopee.co.id",
    phone: "0811-9988-7766",
    departmentOrCompany: "PT. Shopee Internasional Indonesia",
    studentsCount: 3,
    status: "Aktif"
  }
];

export const mentorAPI = {
  // Get all mentors list
  listMentors: async () => {
    return simulateAPIRequest("List all mentors", () => {
      return mockDB.get<Mentor[]>("mentors", INITIAL_MENTORS);
    });
  },

  // Get mentor details by ID
  getMentorById: async (id: number) => {
    return simulateAPIRequest(`Get mentor details for ID: ${id}`, () => {
      const mentors = mockDB.get<Mentor[]>("mentors", INITIAL_MENTORS);
      const mentor = mentors.find(m => m.id === id);
      if (!mentor) {
        throw new Error("Data mentor tidak ditemukan.");
      }
      return mentor;
    });
  },

  // Create mentor (Admin only)
  createMentor: async (payload: CreateMentorRequest) => {
    return simulateAPIRequest(`Create mentor account: ${payload.name}`, () => {
      const mentors = mockDB.get<Mentor[]>("mentors", INITIAL_MENTORS);
      
      const newMentor: Mentor = {
        id: Date.now(),
        name: payload.name,
        type: payload.type,
        identityNo: payload.identityNo,
        email: payload.email,
        phone: payload.phone,
        departmentOrCompany: payload.departmentOrCompany,
        studentsCount: 0,
        status: "Aktif"
      };

      mentors.unshift(newMentor);
      mockDB.set<Mentor[]>("mentors", mentors);
      return newMentor;
    });
  },

  // Update mentor details
  updateMentor: async (id: number, payload: UpdateMentorRequest) => {
    return simulateAPIRequest(`Update mentor details for ID: ${id}`, () => {
      const mentors = mockDB.get<Mentor[]>("mentors", INITIAL_MENTORS);
      const index = mentors.findIndex(m => m.id === id);

      if (index === -1) {
        throw new Error("Data mentor tidak ditemukan.");
      }

      const updatedMentor: Mentor = {
        ...mentors[index],
        ...payload
      };

      mentors[index] = updatedMentor;
      mockDB.set<Mentor[]>("mentors", mentors);
      return updatedMentor;
    });
  },

  // Delete mentor (Admin only)
  deleteMentor: async (id: number) => {
    return simulateAPIRequest(`Delete mentor ID: ${id}`, () => {
      const mentors = mockDB.get<Mentor[]>("mentors", INITIAL_MENTORS);
      const updated = mentors.filter(m => m.id !== id);
      mockDB.set<Mentor[]>("mentors", updated);
      return true;
    });
  }
};
