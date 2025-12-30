import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  discordUser: text("discord_user").notNull(),
  robloxUser: text("roblox_user").notNull(),
  gfxType: text("gfx_type").notNull(),
  details: text("details"),
  imageUrl: text("image_url"),
  status: text("status").default("Pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["Pending", "In Progress", "Completed", "Cancelled"]),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type UpdateOrderStatus = z.infer<typeof updateOrderStatusSchema>;
