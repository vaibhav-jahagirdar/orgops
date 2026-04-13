import { api } from "@/lib/api";
import { AddMemberFormValues } from "./schema";

export async function addMemberRequest(data: AddMemberFormValues, orgId: string) {
  const payload = {
    role: data.role,
    ...(data.email ? { email: data.email } : {}),
    ...(data.userId !== undefined ? { userId: data.userId } : {}),
  };

  console.log("orgId", orgId);
  console.log("payload", payload);

  const res = await api.post(`/orgs/${orgId}/members`, payload, {timeout: 10000});
  return res.data;
}