import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export default [
  {
    name: "list_users",
    description: "Lista todos los usuarios (requiere JWT+Admin)",
    handler: () => api.get("/users"),
  },
  {
    name: "update_user_role",
    description: "Cambia el rol de un usuario (requiere JWT+Admin)",
    inputSchema: {
      id: z.string(),
      role: z.enum(["user", "admin"]),
    },
    handler: ({ id, ...body }: any) => api.patch(`/users/${id}/role`, body),
  },
  {
    name: "update_my_password",
    description: "Cambia la contraseña del usuario autenticado",
    inputSchema: {
      currentPassword: z.string(),
      newPassword: z.string().min(8),
    },
    handler: (body: any) => api.patch("/users/me/password", body),
  },
  {
    name: "update_my_email",
    description: "Cambia el email del usuario autenticado",
    inputSchema: {
      newEmail: z.string().email(),
      password: z.string(),
    },
    handler: (body: any) => api.patch("/users/me/email", body),
  },
] as ToolDef[];
