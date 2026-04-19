import { TransferOwnershipInput, TransferOwnershipResponse, TransferOwnershipSchema, TransferOwnershipResponseSchema } from "./schema";
import { api } from "@/lib/api";

export async function transferOwnershipRequest(data: TransferOwnershipInput, orgId: number): Promise<TransferOwnershipResponse> {
    const res = await api.patch(`/orgs/${orgId}/members/${data.targetId}/transfer-ownership`, {}, { timeout: 10000 });
    return TransferOwnershipResponseSchema.parse(res.data);
}