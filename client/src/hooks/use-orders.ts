import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertOrder } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useOrders(email?: string) {
  return useQuery({
    queryKey: [api.orders.list.path, email],
    queryFn: async () => {
      const url = email 
        ? `${api.orders.list.path}?email=${encodeURIComponent(email)}`
        : api.orders.list.path;
        
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return api.orders.list.responses[200].parse(await res.json());
    },
    // Only enable if email is NOT provided (admin view) OR if email is valid search
    enabled: !email || (!!email && email.length > 3),
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: [api.orders.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.orders.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch order");
      return api.orders.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertOrder) => {
      const res = await fetch(api.orders.create.path, {
        method: api.orders.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create order");
      }
      return api.orders.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.orders.list.path] });
      toast({
        title: "Order Placed Successfully!",
        description: "We've received your GFX request. Check your tracking page for updates.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to place order",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
