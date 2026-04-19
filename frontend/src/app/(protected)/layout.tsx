import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getMeRequest } from "@/features/auth/hooks";
import { AuthProvider } from "../../../contexts/auth-context";
import React from "react";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value

    if (!accessToken) redirect("/login")

    const queryClient = new QueryClient()

    
    await queryClient.prefetchQuery({
        queryKey: ["me"],
        queryFn: () => getMeRequest(accessToken),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </HydrationBoundary>
    )
}