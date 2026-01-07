import { useState } from "react";
import { useOrders } from "@/hooks/use-orders";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ArrowRight, 
  MessageCircle,
  Download,
  CreditCard
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function Tracking() {
  const [emailSearch, setEmailSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const { data: orders, isLoading, isError } = useOrders(activeSearch);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSearch.trim()) setActiveSearch(emailSearch.trim());
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#0a0c10] text-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6 text-glow">
            Order Tracking
          </h1>
          <p className="text-zinc-500 text-xl font-medium max-w-xl mx-auto">
            Check the live status of your Monkey Studio commissions and complete payments.
          </p>
        </motion.div>

        {/* Search Box */}
        <div className="max-w-2xl mx-auto mb-20">
          <form onSubmit={handleSearch} className="flex gap-3 bg-zinc-900/50 p-2 rounded-[24px] border border-zinc-800/50 backdrop-blur-xl">
            <Input 
              type="email" 
              placeholder="Enter your email address..." 
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              className="h-14 bg-transparent border-0 rounded-xl focus-visible:ring-0 text-lg px-6 placeholder:text-zinc-600"
            />
            <Button type="submit" size="lg" className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest shadow-lg shadow-primary/20">
              Search <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {activeSearch && (
            <motion.div
              key={activeSearch}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-zinc-500 font-bold uppercase tracking-widest">Searching orders...</p>
                </div>
              ) : orders && orders.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-zinc-900/30 rounded-[42px] border border-zinc-800 border-dashed">
                  <Package className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">No Commissions Found</h3>
                  <p className="text-zinc-500 font-medium">We couldn't find any orders for <span className="text-white">{activeSearch}</span></p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: any }) {
  const { toast } = useToast();

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "in progress": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "making": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "ready": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "completed": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending verif": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "refunded": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  const handleUpdatePaymentStatus = async (orderId: number, paymentStatus: string) => {
    try {
      await apiRequest("PATCH", `/api/orders/${orderId}/payment`, { paymentStatus });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: "Verification Requested", description: "Admin will verify your payment shortly." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };

  return (
    <Card className="bg-[#101218] border-zinc-800 rounded-[32px] overflow-hidden group hover:border-primary/30 transition-all duration-500">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Status Bar */}
          <div className="md:w-48 bg-zinc-900/50 p-8 flex flex-col justify-center items-center gap-4 border-b md:border-b-0 md:border-r border-zinc-800/50">
             <Badge className={`${getStatusStyle(order.status)} rounded-full px-4 py-1 font-black uppercase tracking-tight text-xs border`}>
               {order.status}
             </Badge>
             <div className="text-center">
               <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">Created</p>
               <p className="text-sm font-bold text-zinc-400">{format(new Date(order.createdAt), "MMM d, yy")}</p>
             </div>
          </div>

          {/* Details */}
          <div className="flex-1 p-8 md:p-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-none mb-2">
                  {order.gfxType}
                </h3>
                <p className="text-zinc-500 font-bold text-sm">Order #{order.id.toString().padStart(4, '0')}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-primary">{order.priceRobux} R$</span>
                  <Badge variant="outline" className={`${getPaymentStatusColor(order.paymentStatus)} font-black uppercase tracking-tight text-[10px]`}>
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {order.paymentStatus === 'Unpaid' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-[10px] h-9 rounded-xl px-4">
                          <CreditCard className="w-3 h-3 mr-2" /> Pay Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#101218] border-zinc-800 text-white rounded-[32px]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">How to Pay</DialogTitle>
                          <DialogDescription className="text-zinc-500 font-medium">Follow these steps to complete your Robux payment.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                            <p className="text-sm font-medium text-zinc-300">1. Purchase the Gamepass from our group store.</p>
                            <p className="text-sm font-medium text-zinc-300">2. Ensure the amount matches <span className="text-primary font-bold">{order.priceRobux} R$</span>.</p>
                            <p className="text-sm font-medium text-zinc-300">3. Join our discord and message the owner with proof.</p>
                          </div>
                          <Button 
                            className="w-full h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold uppercase tracking-widest text-xs"
                            onClick={() => handleUpdatePaymentStatus(order.id, 'Pending Verif')}
                          >
                            I have paid, verify me
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  {order.status === "Ready" && order.imageUrl && order.paymentStatus === "Paid" ? (
                    <a href={order.imageUrl} download target="_blank" rel="noreferrer" className="p-3 bg-primary/10 rounded-2xl hover:bg-primary/20 transition-colors group/link">
                      <Download className="w-6 h-6 text-primary" />
                    </a>
                  ) : (
                    <Button variant="ghost" className="text-zinc-500 hover:text-primary gap-2 font-bold uppercase tracking-tighter text-xs h-9" onClick={() => window.open(`https://discord.com/users/${order.discordUser}`, '_blank')}>
                      <MessageCircle className="w-4 h-4" /> Contact Owner
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-3">Project Details</p>
                <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 italic">"{order.details || "No special instructions provided."}"</p>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-2">Discord Identity</p>
                  <p className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" /> {order.discordUser}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-2">Roblox Profile</p>
                  <p className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> {order.robloxUser}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
