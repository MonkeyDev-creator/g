import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

import { sessionSettings } from "./session";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup session for admin
  app.use(session(sessionSettings));

  registerObjectStorageRoutes(app);

  // Maintenance Middleware
  app.use(async (req, res, next) => {
    // Skip maintenance check for static files and essential admin paths
    if (
      req.path.startsWith('/assets') || 
      req.path.startsWith('/@') || 
      req.path.startsWith('/api/admin/login') || 
      req.path.startsWith('/api/admin/me') ||
      req.path.startsWith('/api/admin/maintenance')
    ) {
      return next();
    }

    try {
      const isMaintenance = await storage.getMaintenanceMode();
      const isAdmin = (req.session as any).admin;
      
      if (isMaintenance && !isAdmin) {
        if (req.path.startsWith('/api')) {
          return res.status(503).json({ message: "System under maintenance" });
        }
      }
    } catch (e) {
      console.error("Maintenance middleware error:", e);
    }
    next();
  });

  // Maintenance API
  app.get("/api/admin/maintenance", async (req, res) => {
    const enabled = await storage.getMaintenanceMode();
    res.json({ enabled });
  });

  app.post("/api/admin/maintenance", async (req, res) => {
    if (!(req.session as any).admin) return res.status(401).json({ message: "Unauthorized" });
    const { enabled } = req.body;
    await storage.setMaintenanceMode(enabled);
    res.json({ message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'}` });
  });

  // Orders API
  app.get(api.orders.list.path, async (req, res) => {
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
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.patch(api.orders.updateStatus.path, async (req, res) => {
    if (!(req.session as any).admin) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const { status } = api.orders.updateStatus.input.parse(req.body);
      const updated = await storage.updateOrderStatus(Number(req.params.id), status);
      if (!updated) return res.status(404).json({ message: "Order not found" });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: "Invalid status" });
    }
  });

  app.patch("/api/orders/:id/payment", async (req, res) => {
    if (!(req.session as any).admin) return res.status(401).json({ message: "Unauthorized" });
    const { paymentStatus } = req.body;
    const updated = await storage.updateOrderPaymentStatus(Number(req.params.id), paymentStatus);
    if (!updated) return res.status(404).json({ message: "Order not found" });
    res.json(updated);
  });

  app.patch("/api/orders/:id/price", async (req, res) => {
    if (!(req.session as any).admin) return res.status(401).json({ message: "Unauthorized" });
    const { price } = req.body;
    const updated = await storage.updateOrderPrice(Number(req.params.id), price);
    if (!updated) return res.status(404).json({ message: "Order not found" });
    res.json(updated);
  });

  app.delete(api.orders.delete.path, async (req, res) => {
    res.status(204).end();
  });

  // Admin API
  if (api.admin) {
    app.post(api.admin.login.path, async (req, res) => {
      try {
        const { username, password } = api.admin.login.input.parse(req.body);
        const admin = await storage.getAdminByUsername(username);
        if (!admin || admin.password !== password) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        (req.session as any).admin = { username: admin.username };
        res.json({ message: "Logged in" });
      } catch (err) {
        res.status(400).json({ message: "Invalid input" });
      }
    });

    app.get(api.admin.me.path, async (req, res) => {
      const adminSession = (req.session as any).admin;
      if (!adminSession) return res.status(401).json({ message: "Not logged in" });
      
      const admin = await storage.getAdminByUsername(adminSession.username);
      if (!admin) return res.status(401).json({ message: "Admin not found" });
      
      res.json(admin);
    });

    app.get(api.admin.list.path, async (req, res) => {
      if (!(req.session as any).admin) return res.status(401).json({ message: "Unauthorized" });
      const adminsList = await storage.getAdmins();
      res.json(adminsList);
    });

    app.post(api.admin.create.path, async (req, res) => {
      if (!(req.session as any).admin) return res.status(401).json({ message: "Unauthorized" });
      try {
        const input = api.admin.create.input.parse(req.body);
        const newAdmin = await storage.createAdmin(input);
        res.status(201).json(newAdmin);
      } catch (err) {
        res.status(400).json({ message: "Failed to create admin" });
      }
    });
  }

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
      imageUrl: null,
    });
  }

  const admin = await storage.getAdminByUsername("admin");
  if (!admin) {
    await storage.createAdmin({
      email: "genshin187anime@gmail.com",
      username: "admin",
      password: "adminpassword",
      isAdmin: true,
    });
    console.log("Seeded database with admin account");
  }
}
