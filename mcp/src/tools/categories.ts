import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export default [
  {
    name: "list_categories",
    description: "Lista todas las categorías ordenadas alfabéticamente",
    handler: () => api.get("/categories"),
  },
  {
    name: "get_category",
    description: "Obtiene una categoría por su ID",
    inputSchema: { id: z.number().int().positive() },
    handler: ({ id }: any) => api.get(`/categories/${id}`),
  },
  {
    name: "create_category",
    description: "Crea una categoría (requiere JWT+Admin)",
    inputSchema: { name: z.string().min(1).max(128) },
    handler: (body: any) => api.post("/categories", body),
  },
  {
    name: "update_category",
    description: "Actualiza el nombre de una categoría (requiere JWT+Admin)",
    inputSchema: {
      id: z.number().int().positive(),
      name: z.string().min(1).max(128),
    },
    handler: ({ id, ...body }: any) => api.put(`/categories/${id}`, body),
  },
  {
    name: "delete_category",
    description: "Elimina una categoría (requiere JWT+Admin)",
    inputSchema: { id: z.number().int().positive() },
    handler: ({ id }: any) => api.del(`/categories/${id}`),
  },
] as ToolDef[];
