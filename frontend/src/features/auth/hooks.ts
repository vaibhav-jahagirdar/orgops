"use client";

import { api } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type User = {
  id: number;
  email: string;
  name: string;
  orgs: { id: number; name: string; role: string }[];
};

export async function getMeRequest(): Promise<User> {
  const res = await api.get("/auth/me");
  return res.data;
}


export function useAuth() {
  const queryClient = useQueryClient();

  const meQuery = useQuery<User>({
    queryKey: ["me"],
    queryFn: getMeRequest,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logout = async () => {
    try {
      await api.post("/auth/logout");

    
      queryClient.removeQueries({ queryKey: ["me"] });

      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return {
    user: meQuery.data,
    isLoading: meQuery.isLoading,
    error: meQuery.error,
    logout,
  };
}


export function useMe() {
  const { user, isLoading, error } = useAuth();

  return {
    data: user,
    isLoading,
    error,
  };
}