import { db } from "./db";
import {
  orders,
  type InsertOrder,
  type Order,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByEmail(email: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
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
    // Basic case-insensitive search could be done here, but strictly following schema for now
    return await db.select().from(orders).where(eq(orders.email, email));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }
}

export const storage = new DatabaseStorage();
