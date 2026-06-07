import { executeHybridRequest, mockDB } from "../api-client";
import { Universitas, UniversitasRequest } from "./types";

const INITIAL_UNIVERSITAS: Universitas[] = [
  { id: 1, nameUniversity: "Universitas Indonesia", createdAt: "2026-01-01T00:00:00" },
  { id: 2, nameUniversity: "Institut Teknologi Bandung", createdAt: "2026-01-01T00:00:00" },
  { id: 3, nameUniversity: "Bina Sarana Informatika", createdAt: "2026-01-01T00:00:00" }
];

export const universitasApi = {
  getUniversitasList: async () => {
    return executeHybridRequest<Universitas[]>(
      "Fetch universitas list",
      "/api/universitas",
      { method: "GET" },
      () => mockDB.get<Universitas[]>("universitas", INITIAL_UNIVERSITAS)
    );
  },

  addUniversitas: async (req: UniversitasRequest) => {
    return executeHybridRequest<Universitas>(
      "Add universitas",
      "/api/universitas",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req)
      },
      () => {
        const list = mockDB.get<Universitas[]>("universitas", INITIAL_UNIVERSITAS);
        const newId = list.length > 0 ? Math.max(...list.map(u => u.id)) + 1 : 1;
        const newUniv: Universitas = {
          id: newId,
          nameUniversity: req.nameUniversity,
          createdAt: new Date().toISOString()
        };
        mockDB.set<Universitas[]>("universitas", [...list, newUniv]);
        return newUniv;
      }
    );
  },

  editUniversitas: async (id: number, req: UniversitasRequest) => {
    return executeHybridRequest<Universitas>(
      `Edit universitas ID: ${id}`,
      `/api/universitas/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req)
      },
      () => {
        const list = mockDB.get<Universitas[]>("universitas", INITIAL_UNIVERSITAS);
        const index = list.findIndex(u => u.id === id);
        if (index === -1) throw new Error("Not found");
        
        const updated = { ...list[index], nameUniversity: req.nameUniversity };
        const newList = [...list];
        newList[index] = updated;
        
        mockDB.set<Universitas[]>("universitas", newList);
        return updated;
      }
    );
  },

  deleteUniversitas: async (id: number) => {
    return executeHybridRequest<boolean>(
      `Delete universitas ID: ${id}`,
      `/api/universitas/${id}`,
      { method: "DELETE" },
      () => {
        const list = mockDB.get<Universitas[]>("universitas", INITIAL_UNIVERSITAS);
        mockDB.set<Universitas[]>("universitas", list.filter(u => u.id !== id));
        return true;
      }
    );
  }
};
