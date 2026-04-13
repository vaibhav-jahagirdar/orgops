import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMemberRequest } from "./api";
import { AddMemberFormValues } from "./schema";
import { useParams } from "next/navigation";

export type AddMemberResponse = {
    id: string,
    orgId: string,
    role: string, 
    email: string, 
    userId: string

       
}

export function useAddMember() {
  const queryClient = useQueryClient();

  return useMutation<
    AddMemberResponse,
    Error,
    { data: AddMemberFormValues; orgId: string }
  >({
    mutationFn: ({ data, orgId }) => addMemberRequest(data, orgId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["members", variables.orgId],
      });
    },
  });
}