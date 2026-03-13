import { api } from "@/lib/api";

export async function loginRequest(data: {
    email : string
    password : string
}) {
    const res = await api.post("/auth/login", data)
    return res.data
}