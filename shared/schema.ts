import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  discordUser: text("discord_user").notNull(),
  robloxUser: text("roblox_user").notNull(),
  gfxType: text("gfx_type").notNull(),
  details: text("details"),
  imageUrl: text("image_url"),
  status: text("status").default("Pending").notNull(),
  priceRobux: text("price_robux").default("0").notNull(),
  paymentStatus: text("payment_status").default("Unpaid").notNull(),
  watermarkUrl: text("watermark_url"),
  isPayable: boolean("is_payable").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  maintenanceMode: boolean("maintenance_mode").default(false).notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["Pending", "In Progress", "Making", "Ready", "Completed", "Cancelled"]),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type UpdateOrderStatus = z.infer<typeof updateOrderStatusSchema>;
