"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateProjectForm } from "./CreateProjectForm"

export function AddProjectDialog() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useParams()
  const orgId = params.orgId as string

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Project</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Add a new project to this organization.
          </DialogDescription>
        </DialogHeader>

        <CreateProjectForm
          onSuccess={(projectId) => {
            setOpen(false)
            router.push(`/dashboard/${orgId}/projects/${projectId}/tasks/create`)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}