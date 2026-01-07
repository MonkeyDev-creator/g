import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useOrders } from "@/hooks/use-orders";
import { useAdminMe } from "@/hooks/use-admin";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { 
  LayoutDashboard, 
  Plus, 
  Trash2, 
  LogOut,
  Package,
  Clock,
  CheckCircle,
  Gamepad2,
  ExternalLink,
  MessageSquare,
  Settings,
  Download,
  AlertTriangle,
  RefreshCw
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
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const { data: admin, isLoading: adminLoading } = useAdminMe();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { logout } = useAdminAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch maintenance status
  useEffect(() => {
    fetch("/api/admin/maintenance")
      .then(res => res.json())
      .then(data => setIsMaintenance(data.enabled));
  }, []);

  const toggleMaintenance = async () => {
    try {
      await apiRequest("POST", "/api/admin/maintenance", { enabled: !isMaintenance });
      setIsMaintenance(!isMaintenance);
      toast({ 
        title: isMaintenance ? "Maintenance Disabled" : "Maintenance Enabled", 
        description: isMaintenance ? "Website is now live for everyone." : "Only admins can access the site now."
      });
    } catch (e) {
      toast({ title: "Error", description: "Failed to toggle maintenance mode.", variant: "destructive" });
    }
  };

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = 
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.discordUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.robloxUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.gfxType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === "newest") return b.id - a.id;
    if (sortBy === "oldest") return a.id - b.id;
    return 0;
  });

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
      toast({ title: "Success", description: `Status changed to ${status}` });
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
      case "making": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "ready": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "completed": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3 uppercase italic tracking-tighter">
              <LayoutDashboard className="w-8 h-8 text-primary" /> Admin Terminal
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Logged in as <span className="text-primary">{admin.username}</span></p>
          </motion.div>

          <div className="flex gap-3">
            <Button 
              variant={isMaintenance ? "destructive" : "outline"} 
              onClick={toggleMaintenance}
              className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 rounded-xl"
            >
              {isMaintenance ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />}
              {isMaintenance ? "Disable Maintenance" : "Under Maintenance"}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 rounded-xl">
                  <Plus className="w-4 h-4 mr-2" /> New Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#101218] border-zinc-800 text-white rounded-[32px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black uppercase italic italic tracking-tighter">Add Staff Member</DialogTitle>
                  <DialogDescription className="text-zinc-500 font-medium">Create a new studio management account.</DialogDescription>
                </DialogHeader>
                <AddAdminForm />
              </DialogContent>
            </Dialog>
            <Button variant="destructive" onClick={logout} className="rounded-xl font-bold uppercase tracking-tight text-xs">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard title="All Orders" value={orders?.length || 0} icon={<Package className="w-5 h-5" />} />
          <StatCard title="Active" value={orders?.filter(o => ["In Progress", "Making"].includes(o.status)).length || 0} icon={<Clock className="w-5 h-5" />} />
          <StatCard title="Ready/Done" value={orders?.filter(o => ["Ready", "Completed"].includes(o.status)).length || 0} icon={<CheckCircle className="w-5 h-5" />} />
          <StatCard title="New" value={orders?.filter(o => o.status === 'Pending').length || 0} icon={<Plus className="w-5 h-5" />} />
        </div>

        <Card className="bg-[#101218] border-zinc-800 rounded-[32px] overflow-hidden">
          <CardHeader className="border-b border-zinc-800 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">Orders Pipeline</CardTitle>
              <CardDescription className="text-zinc-500 font-medium">Process and manage customer commissions.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <Input 
                placeholder="Search orders..." 
                className="w-full md:w-64 bg-zinc-900/50 border-zinc-800 rounded-xl h-10 text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px] h-10 bg-zinc-900/50 border-zinc-800 text-xs rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-white rounded-xl">
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Making">Making</SelectItem>
                  <SelectItem value="Ready">Ready</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[120px] h-10 bg-zinc-900/50 border-zinc-800 text-xs rounded-xl">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-white rounded-xl">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-900/50 text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-8 py-5 text-left">Customer</th>
                    <th className="px-8 py-5 text-left">GFX Type</th>
                    <th className="px-8 py-5 text-left">Current Status</th>
                    <th className="px-8 py-5 text-left">Assets</th>
                    <th className="px-8 py-5 text-right">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {filteredOrders?.map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-sm">#{order.id.toString().padStart(3, '0')}</span>
                          <span className="text-zinc-500 text-xs font-medium">{order.email}</span>
                          <span className="text-zinc-600 text-[10px] font-medium mt-1">@{order.discordUser}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg"><Gamepad2 className="w-4 h-4 text-primary" /></div>
                          <span className="text-zinc-300 font-bold uppercase tracking-tight text-xs">{order.gfxType}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant="outline" className={`${getStatusColor(order.status)} font-black uppercase tracking-tight text-[10px] px-3 border-2`}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                          {order.imageUrl && (
                            <a href={order.imageUrl} target="_blank" rel="noreferrer" download>
                              <Button size="icon" variant="ghost" className="h-9 w-9 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-primary rounded-xl">
                                <Download className="w-4 h-4" />
                              </Button>
                            </a>
                          )}
                          <Button size="icon" variant="ghost" className="h-9 w-9 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-blue-400 rounded-xl" title={order.discordUser}>
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="h-9 w-9 bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-primary rounded-xl"
                            onClick={() => {
                              const subject = encodeURIComponent(`Your GFX Order #${order.id.toString().padStart(3, '0')} is Ready!`);
                              const body = encodeURIComponent(`Hi!\n\nYour GFX order is ready and waiting for you on Monkey Studio.\n\nYou can track and download it here: ${window.location.origin}/tracking\n\nBest regards,\nMonkey Studio Team`);
                              window.location.href = `mailto:${order.email}?subject=${subject}&body=${body}`;
                            }}
                            title="Email Customer"
                          >
                            <Plus className="w-4 h-4 rotate-45" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Select onValueChange={(val) => handleUpdateStatus(order.id, val)} defaultValue={order.status}>
                            <SelectTrigger className="w-[140px] h-9 bg-zinc-900 border-zinc-800 text-[10px] font-black uppercase tracking-widest rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-zinc-800 text-white rounded-xl">
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Making">Making</SelectItem>
                              <SelectItem value="Ready">Ready</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            size="icon" 
                            variant="destructive" 
                            className="h-9 w-9 rounded-xl"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
    <Card className="bg-[#101218] border-zinc-800 overflow-hidden relative rounded-[32px]">
      <div className="absolute -bottom-4 -right-4 opacity-5 text-primary scale-[3] pointer-events-none">{icon}</div>
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">{icon}</div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">{title}</span>
        </div>
        <div className="text-4xl font-black text-white italic tracking-tighter">{value}</div>
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
      toast({ title: "Authorized", description: "New staff member added." });
    } catch (err) {
      toast({ title: "Failed", description: "Could not create account.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-6">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-zinc-500 uppercase text-[10px] font-black tracking-widest">Login Name</Label>
        <Input name="username" id="username" required className="bg-zinc-900/50 border-zinc-800 rounded-xl h-12" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-zinc-500 uppercase text-[10px] font-black tracking-widest">Contact Email</Label>
        <Input name="email" id="email" type="email" required className="bg-zinc-900/50 border-zinc-800 rounded-xl h-12" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-zinc-500 uppercase text-[10px] font-black tracking-widest">Secret Key</Label>
        <Input name="password" id="password" type="password" required className="bg-zinc-900/50 border-zinc-800 rounded-xl h-12" />
      </div>
      <Button type="submit" className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest" disabled={loading}>
        {loading ? "Registering..." : "Provision Access"}
      </Button>
    </form>
  );
}
