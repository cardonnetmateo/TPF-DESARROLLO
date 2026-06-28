import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export default [
  {
    name: "list_products",
    description: "Lista productos con filtros opcionales y paginación",
    inputSchema: {
      name: z.string().optional(),
      sortBy: z.enum(["id", "name", "price", "stock"]).optional(),
      order: z.enum(["ASC", "DESC"]).optional(),
      page: z.number().int().positive().optional(),
      limit: z.number().int().min(1).max(100).optional(),
    },
    handler: (params: any) => api.get("/products", { params }),
  },
  {
    name: "get_product",
    description: "Obtiene un producto por su ID",
    inputSchema: { id: z.number().int().positive() },
    handler: ({ id }: any) => api.get(`/products/${id}`),
  },
  {
    name: "create_product",
    description: "Crea un nuevo producto (requiere JWT+Admin)",
    inputSchema: {
      name: z.string().max(256),
      price: z.number().positive(),
      stock: z.number().int().min(0).optional().default(0),
      categoryId: z.number().int().positive().nullable().optional(),
    },
    handler: (body: any) => api.post("/products", body),
  },
  {
    name: "update_product",
    description: "Actualiza un producto existente (requiere JWT+Admin)",
    inputSchema: {
      id: z.number().int().positive(),
      name: z.string().max(256).optional(),
      price: z.number().positive().optional(),
      stock: z.number().int().min(0).optional(),
      categoryId: z.number().int().positive().nullable().optional(),
    },
    handler: ({ id, ...body }: any) => api.put(`/products/${id}`, body),
  },
  {
    name: "delete_product",
    description: "Elimina un producto (requiere JWT+Admin)",
    inputSchema: { id: z.number().int().positive() },
    handler: ({ id }: any) => api.del(`/products/${id}`),
  },
] as ToolDef[];
