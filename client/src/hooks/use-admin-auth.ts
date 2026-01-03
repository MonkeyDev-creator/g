import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

export function useAdminAuth() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const logout = async () => {
    try {
      // In a real app, call a logout endpoint. 
      // For now we'll just clear client state and redirect
      queryClient.setQueryData(["/api/admin/me"], null);
      setLocation("/admin");
      toast({ title: "Logged Out", description: "Session ended successfully." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to logout.", variant: "destructive" });
    }
  };

  return { logout };
}
