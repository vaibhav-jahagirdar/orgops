"use client"

import { useCreateOrg} from "@/features/orgs/hooks"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { orgSchema, orgInput } from "@/features/orgs/schema"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { Building2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export  default function CreateOrg() {
    const router = useRouter()
    const orgMutation = useCreateOrg()

    const {
        register,
        handleSubmit, 
        formState : {errors},
    } = useForm<orgInput>({resolver : zodResolver(orgSchema)})

    const onSubmit = async (data: orgInput) => {
       try {
         const res = await orgMutation.mutateAsync(data)
         const orgId = res.id
         router.push(`/dashboard/${orgId}`)
       } catch (error) {
        
       }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 -px/4">
            <Card className="max-w-lg w-full shadow-lg border">
                <CardHeader
                className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-md bg-primary/10 text-primary">
                        <Building2 className="h-7 w-7" />
                            </div>
                        <CardTitle className="text-3xl font-semibold">
                            Create Organization
                        </CardTitle>
                    </div>
                    <CardDescription className="text-lg ">
                        Organization lets you manage tasks, projects and members under a shared workspace 
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form 
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-md pl-2 font-medium">Organization name</label>
                            <Input
                            type="text"
                            placeholder="Enter your Organization name"
                            {...register("name")} />
                            {errors.name && (
                                <p>{errors.name.message}</p>
                            )}
                        </div>
                        {orgMutation.isError && (
                            <p className="text-sm text-destructive"> Unable to create Organization please try again.</p>
                        )}
                        <Button
                        type="submit"
                        className="w-full bg-blue-600 text-base "
                        disabled={orgMutation.isPending}>
                            {orgMutation.isPending && (
                             <Loader2 className="mr-3 h-4 w-5 animate-spin"/>
                            )}
                            Create Organization
                        </Button>

                    </form>
                </CardContent>
            </Card>

        </div>
    )
}