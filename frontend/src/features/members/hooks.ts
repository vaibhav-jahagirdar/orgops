import { useQuery } from "@tanstack/react-query";
import { getMembersRequest } from "./api";
import type { ListMembersResponse, ListMembersQuery } from "./schema";

export function useMembers(orgId: number, query?: Partial<ListMembersQuery>) {
  const isValidOrgId = Number.isFinite(orgId) && orgId > 0;

  return useQuery<ListMembersResponse, Error>({
    queryKey: [
      "members",
      orgId,
      query?.page ?? 1,
      query?.limit ?? 15,
      query?.search ?? "",
      query?.role ?? "all",
      query?.sort ?? "role",
    ],
    queryFn: () => getMembersRequest(orgId, query),
    enabled: isValidOrgId,       
    retry: false,               
    refetchOnWindowFocus: false,
  });
}