import { useQuery, useMutation } from "@tanstack/react-query";
import { type Admin } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function useAdminMe() {
  return useQuery<Admin>({
    queryKey: ["/api/admin/me"],
    retry: false,
  });
}

export function useAdmins() {
  return useQuery<Admin[]>({
    queryKey: ["/api/admin/users"],
  });
}
