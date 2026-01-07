import { db } from "./db";
import {
  orders,
  admins,
  systemSettings,
  type InsertOrder,
  type Order,
  type UpdateOrderStatus,
  type Admin,
  type InsertAdmin,
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByEmail(email: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;

  updateOrderPaymentStatus(id: number, paymentStatus: string): Promise<Order | undefined>;
  updateOrderPrice(id: number, price: string): Promise<Order | undefined>;

  // Admins
  getAdmin(id: number): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  getAdmins(): Promise<Admin[]>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;

  // System Settings
  getMaintenanceMode(): Promise<boolean>;
  setMaintenanceMode(enabled: boolean): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrdersByEmail(email: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.email, email));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async updateOrderPaymentStatus(id: number, paymentStatus: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ paymentStatus })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async updateOrderPrice(id: number, price: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ priceRobux: price })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async deleteOrder(id: number): Promise<boolean> {
    const result = await db.delete(orders).where(eq(orders.id, id)).returning();
    return result.length > 0;
  }

  async getAdmin(id: number): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin;
  }

  async getAdmins(): Promise<Admin[]> {
    return await db.select().from(admins);
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const [admin] = await db.insert(admins).values(insertAdmin).returning();
    return admin;
  }

  async getMaintenanceMode(): Promise<boolean> {
    const [settings] = await db.select().from(systemSettings).where(eq(systemSettings.id, 1));
    return settings?.maintenanceMode || false;
  }

  async setMaintenanceMode(enabled: boolean): Promise<void> {
    const [existing] = await db.select().from(systemSettings).where(eq(systemSettings.id, 1));
    if (existing) {
      await db.update(systemSettings).set({ maintenanceMode: enabled }).where(eq(systemSettings.id, 1));
    } else {
      await db.insert(systemSettings).values({ id: 1, maintenanceMode: enabled });
    }
  }
}

export const storage = new DatabaseStorage();
