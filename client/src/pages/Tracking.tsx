import { useState } from "react";
import { useOrders } from "@/hooks/use-orders";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function Tracking() {
  const [emailSearch, setEmailSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  
  const { data: orders, isLoading, isError } = useOrders(activeSearch);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSearch.trim()) {
      setActiveSearch(emailSearch.trim());
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20";
      case "in progress": return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20";
      case "completed": return "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20";
      case "cancelled": return "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return <CheckCircle className="w-4 h-4 mr-1" />;
      case "cancelled": return <XCircle className="w-4 h-4 mr-1" />;
      default: return <Clock className="w-4 h-4 mr-1" />;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold mb-4">Track Your Order</h1>
          <p className="text-muted-foreground text-lg">
            Enter your email address to check the status of your commissions.
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-md mx-auto mb-16">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input 
              type="email" 
              placeholder="Enter your email..." 
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              className="h-12 bg-card border-white/10 rounded-xl focus:ring-primary/20 focus:border-primary/50"
            />
            <Button type="submit" size="lg" className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              <Search className="w-5 h-5" />
            </Button>
          </form>
        </div>

        {/* Results Area */}
        {activeSearch && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            ) : isError ? (
              <div className="text-center py-10 bg-red-500/5 rounded-xl border border-red-500/10">
                <p className="text-red-400 font-medium">Something went wrong fetching your orders.</p>
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4 px-1 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-primary" /> 
                  Found {orders.length} Order{orders.length !== 1 ? 's' : ''}
                </h2>
                {orders.map((order) => (
                  <Card key={order.id} className="bg-card/50 border-white/5 overflow-hidden hover:border-primary/30 transition-colors">
                    <CardHeader className="pb-3 border-b border-white/5 bg-white/[0.02]">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg font-display tracking-wide">{order.gfxType} Commission</CardTitle>
                          <CardDescription className="mt-1">
                            Placed on {order.createdAt ? format(new Date(order.createdAt), "MMMM do, yyyy") : "Unknown Date"}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className={`${getStatusColor(order.status)} px-3 py-1 text-sm border font-medium`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Details</p>
                          <p className="text-sm leading-relaxed text-gray-300">{order.details || "No details provided."}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs uppercase text-muted-foreground font-bold tracking-wider">User Info</p>
                          <div className="flex flex-col gap-1">
                            <p className="text-sm text-gray-400"><span className="text-primary/70">Discord:</span> {order.discordUser}</p>
                            <p className="text-sm text-gray-400"><span className="text-primary/70">Roblox:</span> {order.robloxUser}</p>
                          </div>
                        </div>
                      </div>
                      
                      {order.imageUrl && (
                        <div className="mt-6 pt-4 border-t border-white/5">
                          <p className="text-xs uppercase text-muted-foreground font-bold tracking-wider mb-2">Reference Image</p>
                          <a 
                            href={order.imageUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm flex items-center gap-1"
                          >
                            View Uploaded Reference <span className="text-xs">↗</span>
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card/30 rounded-2xl border border-white/5 border-dashed">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-bold mb-2">No orders found</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  We couldn't find any orders associated with <strong>{activeSearch}</strong>. 
                  Please check the spelling or place a new order.
                </p>
                <Link href="/order" className="mt-6 inline-block">
                  <Button variant="outline">Place Order Now</Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
