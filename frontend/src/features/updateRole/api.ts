import { api } from "@/lib/api";
import { UpdateUserRoleResponse, UpdateUserRoleInput,UpdateUserRoleResponseSchema, UpdateUserRoleSchema  } from "./schema";

export async function updateUserRoleRequest(
    data: UpdateUserRoleInput & { orgId: number }
): Promise<UpdateUserRoleResponse> {
    const res = await api.patch(
        `/orgs/${data.orgId}/members/${data.targetId}/role`,
        { role: data.role }
    )
    return UpdateUserRoleResponseSchema.parse(res.data)
}