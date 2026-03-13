import { api } from "@/lib/api";
import { orgInput } from "./schema";

export async function createOrgRequest(data: orgInput ) {
    const res = await api.post("/orgs/create", data)
    return res.data
}























