"use client"

import { useCreateTask } from "@/features/tasks/hooks"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { createTaskSchema } from "@/features/tasks/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type FormValues = z.infer<typeof createTaskSchema>

const priorityConfig = {
  low: {
    label: "Low",
    activeDot: "#34d399",
    activeClass: "active-low",
  },
  medium: {
    label: "Medium",
    activeDot: "#fbbf24",
    activeClass: "active-medium",
  },
  high: {
    label: "High",
    activeDot: "#f87171",
    activeClass: "active-high",
  },
}

export default function CreateTask() {
  const router = useRouter()
  const taskMutation = useCreateTask()

  const form = useForm<FormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: undefined,
      priority: "medium",
      dueDate: undefined,
    },
  })

  const selectedPriority = form.watch("priority") as keyof typeof priorityConfig

  const onSubmit = async (data: FormValues) => {
    try {
      await taskMutation.mutateAsync(data)
      router.push("/")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        .ct-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100svh;
          background: #0c0a09;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(251,191,36,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 80% 80%, rgba(251,191,36,0.04) 0%, transparent 50%);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: clamp(1.5rem, 6vw, 3.5rem) clamp(1rem, 4vw, 1.5rem);
        }

        .ct-card {
          width: 100%;
          max-width: 560px;
          background: #141210;
          border: 1px solid rgba(251,191,36,0.12);
          border-radius: 20px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.03) inset,
            0 40px 80px rgba(0,0,0,0.6),
            0 0 60px rgba(251,191,36,0.04);
        }

        .ct-header {
          padding: clamp(1.5rem, 5vw, 2.5rem) clamp(1.5rem, 5vw, 2.5rem) 0;
        }

        .ct-eyebrow {
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #d97706;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 0 0.75rem;
        }

        .ct-eyebrow::before {
          content: '';
          width: 18px;
          height: 1px;
          background: #d97706;
        }

        .ct-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.8rem, 6vw, 2.4rem);
          color: #fef3c7;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0 0 0.4rem;
        }

        .ct-heading em {
          font-style: italic;
        }

        .ct-sub {
          font-size: 0.84rem;
          color: #78716c;
          font-weight: 300;
          margin: 0;
        }

        .ct-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(251,191,36,0.15) 30%, rgba(251,191,36,0.15) 70%, transparent);
          margin: clamp(1.25rem, 4vw, 2rem) 0 0;
        }

        .ct-form {
          padding: clamp(1.5rem, 5vw, 2rem) clamp(1.5rem, 5vw, 2.5rem) clamp(1.75rem, 5vw, 2.5rem);
          display: flex;
          flex-direction: column;
          gap: clamp(1.1rem, 3.5vw, 1.6rem);
        }

        .ct-label {
          display: block;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #a8a29e;
          margin-bottom: 0.5rem !important;
        }

        .ct-label-note {
          font-weight: 300;
          font-size: 0.7rem;
          text-transform: none;
          letter-spacing: 0;
          color: #44403c;
          margin-left: 0.25rem;
        }

        /* Inputs */
        .ct-input,
        .ct-textarea {
          width: 100% !important;
          background: #1c1917 !important;
          border: 1px solid #292524 !important;
          border-radius: 10px !important;
          color: #fef3c7 !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 0.88rem !important;
          font-weight: 300 !important;
          padding: 0.7rem 0.9rem !important;
          transition: border-color 0.18s, box-shadow 0.18s !important;
          outline: none !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3) inset !important;
          line-height: 1.5 !important;
        }

        .ct-input::placeholder,
        .ct-textarea::placeholder {
          color: #57534e !important;
        }

        .ct-input:focus,
        .ct-textarea:focus {
          border-color: rgba(251,191,36,0.45) !important;
          box-shadow: 0 0 0 3px rgba(251,191,36,0.07), 0 1px 3px rgba(0,0,0,0.3) inset !important;
        }

        .ct-textarea {
          min-height: 88px !important;
          resize: vertical !important;
        }

        /* Priority pills */
        .ct-priority-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.45rem;
        }

        .ct-pill {
          appearance: none;
          border: 1px solid #292524;
          background: #1c1917;
          border-radius: 9px;
          padding: 0.55rem 0.6rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 400;
          color: #57534e;
          cursor: pointer;
          transition: all 0.16s;
          white-space: nowrap;
        }

        .ct-pill:hover {
          border-color: #3c3836;
          color: #a8a29e;
        }

        .ct-pill.active-low {
          border-color: rgba(52,211,153,0.35);
          background: rgba(52,211,153,0.06);
          color: #6ee7b7;
        }

        .ct-pill.active-medium {
          border-color: rgba(251,191,36,0.35);
          background: rgba(251,191,36,0.06);
          color: #fcd34d;
        }

        .ct-pill.active-high {
          border-color: rgba(248,113,113,0.35);
          background: rgba(248,113,113,0.06);
          color: #fca5a5;
        }

        .ct-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
          transition: background 0.16s;
        }

        /* Date button */
        .ct-date-btn {
          all: unset;
          box-sizing: border-box;
          width: 100%;
          background: #1c1917;
          border: 1px solid #292524;
          border-radius: 10px;
          color: #57534e;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 300;
          padding: 0.7rem 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          transition: all 0.18s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3) inset;
        }

        .ct-date-btn:hover {
          border-color: #3c3836;
          color: #a8a29e;
        }

        .ct-date-btn.has-date {
          color: #fef3c7;
          border-color: rgba(251,191,36,0.3);
        }

        .ct-date-btn svg {
          flex-shrink: 0;
          opacity: 0.5;
        }

        /* Calendar popover */
        .ct-cal-popover {
          background: #1c1917 !important;
          border: 1px solid #292524 !important;
          border-radius: 14px !important;
          box-shadow: 0 24px 48px rgba(0,0,0,0.7) !important;
          padding: 0.75rem !important;
        }

        /* Actions row */
        .ct-actions {
          display: flex;
          gap: 0.75rem;
          padding-top: 0.25rem;
        }

        .ct-cancel {
          all: unset;
          box-sizing: border-box;
          border: 1px solid #292524;
          border-radius: 10px;
          color: #57534e;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 400;
          padding: 0.72rem 1.2rem;
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .ct-cancel:hover {
          border-color: #3c3836;
          color: #a8a29e;
        }

        .ct-submit {
          all: unset;
          box-sizing: border-box;
          flex: 1;
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          border-radius: 10px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.72rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.18s;
          box-shadow: 0 4px 16px rgba(217,119,6,0.3), 0 1px 0 rgba(255,255,255,0.12) inset;
        }

        .ct-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(217,119,6,0.4), 0 1px 0 rgba(255,255,255,0.12) inset;
        }

        .ct-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .ct-submit:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
        }

        /* Loading dots */
        .ct-dots {
          display: inline-flex;
          gap: 3px;
          align-items: center;
        }

        .ct-dots span {
          display: block;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: currentColor;
          animation: ct-blink 1.2s infinite;
        }

        .ct-dots span:nth-child(2) { animation-delay: 0.2s; }
        .ct-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes ct-blink {
          0%, 80%, 100% { opacity: 0.3; }
          40% { opacity: 1; }
        }

        /* Error message */
        .ct-form [data-slot="form-message"],
        .ct-form p[aria-live] {
          font-size: 0.73rem !important;
          color: #fca5a5 !important;
          margin-top: 0.3rem !important;
          font-family: 'DM Sans', sans-serif !important;
        }

        /* Responsive */
        @media (max-width: 380px) {
          .ct-priority-grid {
            grid-template-columns: 1fr;
          }

          .ct-actions {
            flex-direction: column-reverse;
          }

          .ct-cancel {
            text-align: center;
          }
        }

        @media (min-width: 640px) {
          .ct-card {
            border-radius: 24px;
          }
        }
      `}</style>

      <div className="ct-root">
        <div className="ct-card">
          {/* Header */}
          <div className="ct-header">
            <p className="ct-eyebrow">New Task</p>
            <h1 className="ct-heading">
              What needs<br /><em>doing?</em>
            </h1>
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
                      <Input
                        placeholder="e.g. Review Q3 report"
                        className="ct-input"
                        {...field}
                      />
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
                      Description
                      <span className="ct-label-note">— optional</span>
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
                                style={{
                                  background: isActive ? cfg.activeDot : "#3c3836",
                                }}
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
                      Due Date
                      <span className="ct-label-note">— optional</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={`ct-date-btn ${field.value ? "has-date" : ""}`}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <rect x="1" y="2.5" width="12" height="10.5" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                            <path d="M4.5 1V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                            <path d="M9.5 1V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                            <path d="M1 6H13" stroke="currentColor" strokeWidth="1.2"/>
                          </svg>
                          {field.value
                            ? field.value.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
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
                <button
                  type="button"
                  className="ct-cancel"
                  onClick={() => router.back()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ct-submit"
                  disabled={taskMutation.isPending}
                >
                  {taskMutation.isPending ? (
                    <>
                      Creating
                      <span className="ct-dots">
                        <span /><span /><span />
                      </span>
                    </>
                  ) : (
                    "Create Task"
                  )}
                </button>
              </div>

            </form>
          </Form>
        </div>
      </div>
    </>
  )
}