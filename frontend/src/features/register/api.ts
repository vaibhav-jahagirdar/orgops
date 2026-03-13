import { api } from "@/lib/api";


export async function registerRequest(data: {
    name: string
    email: string
    password: string 

}) {
    const res = await api.post("/auth/register", data)
    return res.data
}
