import { z } from "zod";
import { insertOrderSchema, orders, updateOrderStatusSchema, insertAdminSchema, admins } from "./schema";

export const api = {
  orders: {
    list: {
      method: "GET" as const,
      path: "/api/orders",
      input: z.object({
        email: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof orders.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/orders",
      input: insertOrderSchema,
      responses: {
        201: z.custom<typeof orders.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/orders/:id",
      responses: {
        200: z.custom<typeof orders.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    updateStatus: {
      method: "PATCH" as const,
      path: "/api/orders/:id/status",
      input: updateOrderStatusSchema,
      responses: {
        200: z.custom<typeof orders.$inferSelect>(),
        400: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/orders/:id",
      responses: {
        204: z.void(),
        404: z.object({ message: z.string() }),
      },
    },
  },
  admin: {
    me: {
      method: "GET" as const,
      path: "/api/admin/me",
      responses: {
        200: z.object({ username: z.string() }),
        401: z.object({ message: z.string() }),
      },
    },
    login: {
      method: "POST" as const,
      path: "/api/admin/login",
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.object({ message: z.string() }),
        401: z.object({ message: z.string() }),
      },
    },
    list: {
      method: "GET" as const,
      path: "/api/admin/users",
      responses: {
        200: z.array(z.custom<typeof admins.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/admin/users",
      input: insertAdminSchema,
      responses: {
        201: z.custom<typeof admins.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
