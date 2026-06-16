import { executeHybridRequest } from "../api-client";
import { API_ROUTES } from "../api-routes";
import { Universitas, UniversitasRequest } from "./types";
export const universitasApi = {
  getUniversitasList: async () => {
    return executeHybridRequest<Universitas[]>(
      "Fetch universitas list",
      API_ROUTES.UNIVERSITAS_LIST,
      { method: "GET" }
    );
  },

  addUniversitas: async (req: UniversitasRequest) => {
    return executeHybridRequest<Universitas>(
      "Add universitas",
      API_ROUTES.UNIVERSITAS_LIST,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req)
      }
    );
  },

  editUniversitas: async (id: number, req: UniversitasRequest) => {
    return executeHybridRequest<Universitas>(
      `Edit universitas ID: ${id}`,
      API_ROUTES.UNIVERSITAS_DETAIL(id),
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req)
      }
    );
  },

  deleteUniversitas: async (id: number) => {
    return executeHybridRequest<boolean>(
      `Delete universitas ID: ${id}`,
      API_ROUTES.UNIVERSITAS_DETAIL(id),
      { method: "DELETE" }
    );
  }
};
