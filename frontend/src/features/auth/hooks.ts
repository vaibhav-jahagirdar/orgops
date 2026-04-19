import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export type User = {
    id: number
    email: string
    name: string
    orgs: { id: number; name: string; role: string }[]
}

export async function getMeRequest(token?: string): Promise<User> {
    const res = await api.get("/auth/me", {
        headers: token ? { Cookie: `accessToken=${token}` } : undefined,
    })
    return res.data
}
export function useMe() {
    return useQuery<User>({
        queryKey: ["me"],
        queryFn: () => getMeRequest(),
        refetchOnWindowFocus: false
    })
}