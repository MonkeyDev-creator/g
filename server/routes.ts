import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register Object Storage Routes
  registerObjectStorageRoutes(app);

  app.get(api.orders.list.path, async (req, res) => {
    // Simple filter by email if provided
    const email = req.query.email as string | undefined;
    if (email) {
      const orders = await storage.getOrdersByEmail(email);
      return res.json(orders);
    }
    const orders = await storage.getOrders();
    res.json(orders);
  });

  app.get(api.orders.get.path, async (req, res) => {
    const order = await storage.getOrder(Number(req.params.id));
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  });

  app.post(api.orders.create.path, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder(input);
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      throw err;
    }
  });

  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingOrders = await storage.getOrders();
  if (existingOrders.length === 0) {
    await storage.createOrder({
      email: "test@example.com",
      discordUser: "testuser#1234",
      robloxUser: "CoolRobloxPlayer",
      gfxType: "Thumbnail",
      details: "I want a space themed thumbnail with my avatar.",
      status: "In Progress",
    });
    await storage.createOrder({
      email: "demo@example.com",
      discordUser: "demo#9999",
      robloxUser: "DemoPlayer",
      gfxType: "Icon",
      details: "Simple icon with bright colors.",
      status: "Completed",
    });
    console.log("Seeded database with initial orders");
  }
}
