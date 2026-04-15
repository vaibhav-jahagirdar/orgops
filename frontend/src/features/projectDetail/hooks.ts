import { fetchProjectDetail } from "./api";
import { ProjectDetailResponse } from "./schema";
import { useQuery } from "@tanstack/react-query";


export function useProjectDetail(
  orgId: number ,
  projectId: number) {
    return useQuery<ProjectDetailResponse, Error>({
        queryKey: ["projectDetail", orgId, projectId],
        queryFn: () => fetchProjectDetail({ orgId, projectId }),
    })
}