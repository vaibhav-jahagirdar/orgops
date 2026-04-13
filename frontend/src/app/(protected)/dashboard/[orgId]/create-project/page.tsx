'use client'

import { useRouter } from 'next/navigation'
import { useCreateProject } from '@/features/addProjects/hooks'
import { useForm } from 'react-hook-form'
import { projectInput, projectSchema } from '@/features/addProjects/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function CreateProject() {
  const router = useRouter()
  const projectMutation = useCreateProject()
  const params = useParams()
const orgId =  params.orgId

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<projectInput>({ resolver: zodResolver(projectSchema) })

  const onSubmit = async (data: projectInput) => {
    try {
       const res = await projectMutation.mutateAsync(data)
       console.log("CREATE PROJECT RESPONSE", res)
       const projectId = res.project.id
        router.push(`/dashboard/${orgId}/projects/${projectId}/tasks/create`)
    } catch (error) {

    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>


      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:px-6 lg:px-8">

        <div className="w-full max-w-2xl">

          <div className="mb-12 space-y-6 animate-fade-in-down">
     
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance">
                Create your{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  next project
                </span>
              </h1>
            </div>

      
            <p className="text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
              Create a workspace to organize tasks, track progress, and collaborate with your team seamlessly.
            </p>
          </div>


          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-2xl" />

            <div className="relative backdrop-blur-md bg-card/50 border border-border rounded-2xl p-8 sm:p-10 shadow-2xl hover:shadow-xl transition-shadow duration-500">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
       
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-foreground">
                    Project Name
                  </label>
                  <div className="relative group">
                    <Input
                      type="text"
                      placeholder="Enter your project name"
                      className="w-full px-4 py-3 sm:py-4 text-base bg-background border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground/50"
                      {...register('name')}
                    />
                    <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>

               
                  {errors.name && (
                    <p className="text-sm text-destructive font-medium animate-fade-in">
                      {errors.name.message}
                    </p>
                  )}
                </div>


                {projectMutation.isError && (
                  <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg animate-fade-in">
                    <p className="text-sm text-destructive font-medium">
                      Unable to create project. Please try again.
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={projectMutation.isPending}
                  className="w-full py-3 sm:py-4 px-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl text-base"
                >
                  <div className="flex items-center justify-center gap-2">
                    {projectMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating project...</span>
                      </>
                    ) : (
                      <span>Create Project</span>
                    )}
                  </div>
                </Button>
              </form>
            </div>
          </div>

   
          <div className="mt-8 text-center text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <p>
              Your project will be set up with all the essential tools to get started immediately.
            </p>
          </div>
        </div>
      </div>

    
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
