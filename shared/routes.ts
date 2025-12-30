import { z } from "zod";
import { insertOrderSchema, orders } from "./schema";

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
