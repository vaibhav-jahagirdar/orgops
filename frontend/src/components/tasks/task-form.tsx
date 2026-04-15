"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { createTaskSchema } from "@/features/tasks/schema"
import { useCreateTask } from "@/features/tasks/hooks"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type FormValues = z.infer<typeof createTaskSchema>

const priorityConfig = {
  low: { label: "Low", activeDot: "#34d399", activeClass: "active-low" },
  medium: { label: "Medium", activeDot: "#fbbf24", activeClass: "active-medium" },
  high: { label: "High", activeDot: "#f87171", activeClass: "active-high" },
} as const

type TaskFormProps = {
  defaultValues?: Partial<FormValues>
  onSuccess?: (data: FormValues) => void
  onCancel?: () => void
  submitLabel?: string
  loadingLabel?: string
  className?: string
}

export function TaskForm({
  defaultValues,
  onSuccess,
  onCancel,
  submitLabel = "Create Task",
  loadingLabel = "Creating",
}: TaskFormProps) {
  const taskMutation = useCreateTask()

  const form = useForm<FormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: undefined,
      priority: "medium",
      dueDate: undefined,
      ...defaultValues,
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      await taskMutation.mutateAsync(data)
      onSuccess?.(data)
      form.reset()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <style>{`
        /* keep your exact styles */
        .ct-root { font-family: 'DM Sans', sans-serif; }
        .ct-card { width: 100%; max-width: 560px; background: #141210; border: 1px solid rgba(251,191,36,0.12); border-radius: 20px; overflow: hidden; }
        .ct-header { padding: clamp(1.5rem, 5vw, 2.5rem) clamp(1.5rem, 5vw, 2.5rem) 0; }
        .ct-eyebrow { font-size: .68rem; font-weight: 500; letter-spacing: .2em; text-transform: uppercase; color: #d97706; margin: 0 0 .75rem; }
        .ct-heading { font-size: clamp(1.8rem, 6vw, 2.4rem); color: #fef3c7; margin: 0 0 .4rem; }
        .ct-sub { font-size: .84rem; color: #78716c; margin: 0; }
        .ct-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(251,191,36,.15) 30%, rgba(251,191,36,.15) 70%, transparent); margin: clamp(1.25rem, 4vw, 2rem) 0 0; }
        .ct-form { padding: clamp(1.5rem, 5vw, 2rem) clamp(1.5rem, 5vw, 2.5rem) clamp(1.75rem, 5vw, 2.5rem); display: flex; flex-direction: column; gap: clamp(1.1rem, 3.5vw, 1.6rem); }
        .ct-label { font-size: .68rem; letter-spacing: .12em; text-transform: uppercase; color: #a8a29e; margin-bottom: .5rem !important; }
        .ct-label-note { font-size: .7rem; color: #44403c; margin-left: .25rem; text-transform: none; letter-spacing: 0; }
        .ct-input, .ct-textarea { width: 100% !important; background: #1c1917 !important; border: 1px solid #292524 !important; border-radius: 10px !important; color: #fef3c7 !important; padding: .7rem .9rem !important; }
        .ct-textarea { min-height: 88px !important; resize: vertical !important; }
        .ct-priority-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: .45rem; }
        .ct-pill { border: 1px solid #292524; background: #1c1917; border-radius: 9px; padding: .55rem .6rem; cursor: pointer; color: #57534e; }
        .ct-pill.active-low { border-color: rgba(52,211,153,.35); background: rgba(52,211,153,.06); color: #6ee7b7; }
        .ct-pill.active-medium { border-color: rgba(251,191,36,.35); background: rgba(251,191,36,.06); color: #fcd34d; }
        .ct-pill.active-high { border-color: rgba(248,113,113,.35); background: rgba(248,113,113,.06); color: #fca5a5; }
        .ct-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; margin-right: .4rem; }
        .ct-date-btn { all: unset; box-sizing: border-box; width: 100%; background: #1c1917; border: 1px solid #292524; border-radius: 10px; color: #57534e; padding: .7rem .9rem; cursor: pointer; display: flex; gap: .6rem; }
        .ct-date-btn.has-date { color: #fef3c7; border-color: rgba(251,191,36,.3); }
        .ct-cal-popover { background: #1c1917 !important; border: 1px solid #292524 !important; border-radius: 14px !important; }
        .ct-actions { display: flex; gap: .75rem; padding-top: .25rem; }
        .ct-cancel { all: unset; border: 1px solid #292524; border-radius: 10px; color: #57534e; padding: .72rem 1.2rem; cursor: pointer; }
        .ct-submit { all: unset; flex: 1; background: linear-gradient(135deg,#d97706 0%,#b45309 100%); border-radius: 10px; color: #fff; padding: .72rem 1.5rem; text-align: center; cursor: pointer; }
        .ct-submit:disabled { opacity: .55; cursor: not-allowed; }
      `}</style>

      <div className="ct-root">
        <div className="ct-card">
          <div className="ct-header">
            <p className="ct-eyebrow">New Task</p>
            <h1 className="ct-heading">What needs doing?</h1>
            <p className="ct-sub">Add details to keep your work on track.</p>
            <div className="ct-divider" />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="ct-form">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="ct-label">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Review Q3 report" className="ct-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="ct-label">
                      Description <span className="ct-label-note">— optional</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add extra context or notes…"
                        className="ct-input ct-textarea"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="ct-label">Priority</FormLabel>
                    <FormControl>
                      <div className="ct-priority-grid">
                        {(["low", "medium", "high"] as const).map((p) => {
                          const cfg = priorityConfig[p]
                          const isActive = field.value === p
                          return (
                            <button
                              key={p}
                              type="button"
                              className={`ct-pill ${isActive ? cfg.activeClass : ""}`}
                              onClick={() => field.onChange(p)}
                            >
                              <span
                                className="ct-dot"
                                style={{ background: isActive ? cfg.activeDot : "#3c3836" }}
                              />
                              {cfg.label}
                            </button>
                          )
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="ct-label">
                      Due Date <span className="ct-label-note">— optional</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button type="button" className={`ct-date-btn ${field.value ? "has-date" : ""}`}>
                          {field.value
                            ? field.value.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "Pick a date"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 ct-cal-popover">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={{ before: new Date() }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="ct-actions">
                <button type="button" className="ct-cancel" onClick={onCancel}>
                  Cancel
                </button>
                <button type="submit" className="ct-submit" disabled={taskMutation.isPending}>
                  {taskMutation.isPending ? loadingLabel : submitLabel}
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}