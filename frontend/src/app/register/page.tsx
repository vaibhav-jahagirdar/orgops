"use client"
import { useRegister } from "@/features/register/hooks"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { RegisterInput, regsiterSchema } from "@/features/register/schema"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"


export default function RegisterPage() {
    const router = useRouter()
    const registerMutation = useRegister()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInput>({ resolver: zodResolver(regsiterSchema) })

    const onSubmit = async (data: RegisterInput) => {
        try {
            await registerMutation.mutateAsync(data)
            router.push("/dashboard")
        } catch (error) {

        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 ">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                        Register with OrgOps
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5">
                        <div className="space-y-2">
                            <Input
                                type="text"
                                placeholder="Enter your full name"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name.message}
                                </p>
                            )}

                        </div>
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                {...register("email")} />
                            {errors.email && (
                                <p className="text-sm text-destructive">
                                    {errors.email.message}

                                </p>
                            )}

                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="password"
                                {...register("password")} />
                            {errors.password && (
                                <p className="text-sm text-destructive">
                                    {errors.password.message}
                                </p>
                            )}

                        </div>
                        {registerMutation.isError && (
                            <p className="text-sm text-destructive">
                                Registration failed

                            </p>
                        )}
                        <Button
                            type="submit"
                            disabled={registerMutation.isPending}
                            className="w-full">
                            {registerMutation.isPending && (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />

                            )}
                            Sign Up
                        </Button>
                        <p className="text-sm text-muted-foreground text-center">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-primary hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>


                    </form>

                </CardContent>

            </Card>
        </div>
    )

}