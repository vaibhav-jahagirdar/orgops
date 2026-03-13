import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export type User = {
    id: number
    email: string
    name: string
    orgs: { id: number; name: string; role: string }[]
}

export async function getMeRequest(): Promise<User> {
    const res = await api.get("/auth/me")
    return res.data
}

export function useMe() {
    return useQuery<User>({
        queryKey: ["me"],
        queryFn: getMeRequest, 
        refetchOnWindowFocus: false
    })
}