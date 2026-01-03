import { useState } from "react";
import { useOrders } from "@/hooks/use-orders";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Clock, CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
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
            Check the live status of your Monkey Studio commissions.
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
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "in progress": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "completed": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
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
              {order.imageUrl && (
                <a href={order.imageUrl} target="_blank" rel="noreferrer" className="p-3 bg-primary/10 rounded-2xl hover:bg-primary/20 transition-colors group/link">
                  <ImageIcon className="w-6 h-6 text-primary" />
                </a>
              )}
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
                    <div className="w-2 h-2 rounded-full bg-primary" /> {order.discordUser}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-2">Roblox Profile</p>
                  <p className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" /> {order.robloxUser}
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
