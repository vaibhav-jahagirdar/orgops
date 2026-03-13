"use client"
import { LoginInput, loginSchema } from "@/features/login/schema"
import { useLogin } from "@/features/login/hooks"
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getMeRequest } from "@/features/auth/hooks"


export default function LoginPage() {
  const router = useRouter()
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })
  const onSubmit = async (data: LoginInput) => {
    try {
      await loginMutation.mutateAsync(data)
      const me = await getMeRequest() 
      if(!me.orgs || me.orgs.length === 0) {
         router.push("/create-org")
      } else {
        router.push(`/dashboard/${me.orgs[0].id}`)
      }
     
    } catch (error) {

    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Sign in to OrgOps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="email"
                {...register("email")} />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-3">
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
            {loginMutation.isError && (
              <p className="text-sm text-destructive">
                Invalid credentials
              </p>
            )}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full">
              {loginMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              New user?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Create an account
              </Link>
            </p>
          </form>
        </CardContent>

      </Card>
    </div>
  )

}

