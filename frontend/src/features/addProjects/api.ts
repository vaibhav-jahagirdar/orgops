import { api } from "@/lib/api";
import { projectInput } from "./schema";



export async function createProject(data: projectInput, orgId: string) {

   
    const res = await api.post(`/orgs/${orgId}/projects`, data)
    return res.data
}