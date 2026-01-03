import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Lock, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      await apiRequest("POST", "/api/admin/login", data);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
      toast({ title: "Success", description: "Welcome to Monkey Studio Admin Panel." });
      setLocation("/admin/dashboard");
    } catch (err) {
      toast({
        title: "Error",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-[#101218] border-zinc-800 shadow-2xl shadow-black/50">
          <CardHeader className="text-center space-y-1 pb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-white tracking-tight">Admin Portal</CardTitle>
            <CardDescription className="text-zinc-500">Authorized Personnel Only</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-zinc-400">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-zinc-600" />
                  <Input 
                    id="username" 
                    name="username" 
                    placeholder="Enter admin username" 
                    required 
                    className="bg-zinc-900/50 border-zinc-800 pl-10 h-11 focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-400">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-600" />
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    className="bg-zinc-900/50 border-zinc-800 pl-10 h-11 focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
                disabled={isLoading}
              >
                {isLoading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : "Access System"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <p className="mt-8 text-center text-zinc-600 text-sm">
          Protected by Monkey Studio Security Infrastructure
        </p>
      </motion.div>
    </div>
  );
}
