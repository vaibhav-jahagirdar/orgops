import { TransferOwnershipInput, TransferOwnershipResponse, TransferOwnershipSchema, TransferOwnershipResponseSchema } from "./schema";
import { transferOwnershipRequest } from "./api";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export function useTransferOwnership() {
    const params = useParams()
    const orgId = Number(params.orgId)
    const queryClient = useQueryClient()


    return useMutation<TransferOwnershipResponse, Error, TransferOwnershipInput>({
        mutationFn: (data) => transferOwnershipRequest(data, orgId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["members", orgId] })
        }

    })
}