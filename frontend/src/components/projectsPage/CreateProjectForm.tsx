"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useCreateProject } from "@/features/addProjects/hooks"
import { projectInput, projectSchema } from "@/features/addProjects/schema"

type Props = {
  onSuccess?: (projectId: number) => void
}

export function CreateProjectForm({ onSuccess }: Props) {
  const mutation = useCreateProject()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<projectInput>({
    resolver: zodResolver(projectSchema),
  })

  const onSubmit = async (data: projectInput) => {
    const res = await mutation.mutateAsync(data)
    const projectId = res.project.id
    onSuccess?.(projectId)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Project Name</label>
        <Input placeholder="Enter project name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {mutation.isError && (
        <p className="text-sm text-destructive">
          Unable to create project. Please try again.
        </p>
      )}

      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Project"
        )}
      </Button>
    </form>
  )
}