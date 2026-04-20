"use client"
import { useMe } from "@/features/auth/hooks";
import { createContext } from "react";
import { useContext } from "react";

 type User = {
    id: number
    email: string
    name: string
}

type AuthContextType = {
    user: User | null
    userId: number | null
    isLoading: boolean
    isError : boolean
}

const AuthContext = createContext<AuthContextType | null>(null)


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data: user, isLoading, error } = useMe()
    return (
        <AuthContext.Provider value={{
            user: user ?? null,
            userId : user?.id ?? null,
            isLoading,
            isError: !!error
        }}>
            {children}
        </AuthContext.Provider>
    )
}


export function useAuth () {
    const context = useContext(AuthContext)
    if(!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context

}
