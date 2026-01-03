import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useOrders } from "@/hooks/use-orders";
import { useAdminMe } from "@/hooks/use-admin";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  LogOut,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  User,
  Gamepad2,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";

export default function AdminDashboard() {
  const { data: admin, isLoading: adminLoading } = useAdminMe();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { logout } = useAdminAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  if (adminLoading) return <div className="flex h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  if (!admin) {
    setLocation("/admin");
    return null;
  }

  const handleUpdateStatus = async (orderId: number, status: string) => {
    setIsUpdating(true);
    try {
      await apiRequest("PATCH", `/api/orders/${orderId}/status`, { status });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: "Success", description: "Order status updated." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await apiRequest("DELETE", `/api/orders/${orderId}`);
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: "Deleted", description: "Order has been removed." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete order.", variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "in progress": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "completed": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-primary" /> Admin Panel
            </h1>
            <p className="text-zinc-400">Welcome back, <span className="text-primary font-medium">{admin.username}</span></p>
          </motion.div>

          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800">
                  <Plus className="w-4 h-4 mr-2" /> Add Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#101218] border-zinc-800 text-white">
                <DialogHeader>
                  <DialogTitle>Add New Administrator</DialogTitle>
                  <DialogDescription>Create a new account for studio management.</DialogDescription>
                </DialogHeader>
                <AddAdminForm />
              </DialogContent>
            </Dialog>
            <Button variant="destructive" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Orders" value={orders?.length || 0} icon={<Package className="w-5 h-5" />} />
          <StatCard title="Active" value={orders?.filter(o => o.status === 'In Progress').length || 0} icon={<Clock className="w-5 h-5" />} />
          <StatCard title="Completed" value={orders?.filter(o => o.status === 'Completed').length || 0} icon={<CheckCircle className="w-5 h-5" />} />
          <StatCard title="Pending" value={orders?.filter(o => o.status === 'Pending').length || 0} icon={<Settings className="w-5 h-5" />} />
        </div>

        {/* Orders List */}
        <Card className="bg-[#101218] border-zinc-800">
          <CardHeader className="border-b border-zinc-800">
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Manage your studio's incoming commissions.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-900/50 text-zinc-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 text-left">ID / Customer</th>
                    <th className="px-6 py-4 text-left">GFX Type</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Links</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {orders?.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-900/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">#{order.id}</span>
                          <span className="text-zinc-500 text-sm truncate max-w-[150px]">{order.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Gamepad2 className="w-4 h-4 text-primary/50" />
                          <span className="text-zinc-300">{order.gfxType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`${getStatusColor(order.status)} font-medium`}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {order.imageUrl && (
                            <a href={order.imageUrl} target="_blank" rel="noreferrer">
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-primary">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </a>
                          )}
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-blue-400" title={order.discordUser}>
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Select onValueChange={(val) => handleUpdateStatus(order.id, val)} defaultValue={order.status}>
                            <SelectTrigger className="w-[130px] h-8 bg-zinc-900 border-zinc-800 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-zinc-500 hover:text-red-400"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orders?.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <Card className="bg-[#101218] border-zinc-800 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5 text-primary scale-150">{icon}</div>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-2 text-zinc-400">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">{icon}</div>
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="text-3xl font-bold text-white">{value}</div>
      </CardContent>
    </Card>
  );
}

function AddAdminForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    try {
      await apiRequest("POST", "/api/admin/users", { ...data, isAdmin: true });
      toast({ title: "Success", description: "New admin created." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to create admin.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input name="username" id="username" required className="bg-zinc-900 border-zinc-800" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input name="email" id="email" type="email" required className="bg-zinc-900 border-zinc-800" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input name="password" id="password" type="password" required className="bg-zinc-900 border-zinc-800" />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Admin Account"}
      </Button>
    </form>
  );
}
