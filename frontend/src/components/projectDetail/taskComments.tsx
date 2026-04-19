"use client"
"use client"

import { useState, useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button }   from "@/components/ui/button"
import { MessageSquare, Send } from "lucide-react"
import { useGetComments } from "@/features/comments/hooks"
import { useCreateComment } from "@/features/createComment/hooks"
import { useAuth } from "../../../contexts/auth-context"

function initials(name: string | null, email: string) {
    if (!name?.trim()) return email.slice(0, 2).toUpperCase()
    return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
}

function timeAgo(dateStr: string) {
    const diff  = Date.now() - new Date(dateStr).getTime()
    const mins  = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days  = Math.floor(diff / 86400000)
    if (mins < 1)   return "just now"
    if (mins < 60)  return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
}

type TaskComment = {
    id: number
    comment: string
    created_by: number
    created_at: string
    author_name: string | null
    author_email: string
}

export function TaskComments({ taskId }: { taskId: number }) {
    const { user }                           = useAuth()
    const { data: commentsData, isLoading }  = useGetComments(taskId)
    console.log("Comments data:", commentsData)
    const { mutate: addComment, isPending }  = useCreateComment()
    const [text, setText]                    = useState("")
    const bottomRef                          = useRef<HTMLDivElement>(null)
    const comments: TaskComment[]            = Array.isArray(commentsData) ? commentsData : commentsData?.comments ?? []

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [comments.length])

    const handleSubmit = () => {
        if (!text.trim() || isPending) return
        addComment(
            { taskId, comment: text.trim() },
            { onSuccess: () => setText("") }
        )
    }

    return (
        <div className="mt-4 border-t border-slate-100 pt-4 space-y-3">

            <div className="flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Comments
                </span>
                {comments.length > 0 && (
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                        {comments.length}
                    </span>
                )}
            </div>

            <div className="max-h-52 space-y-3 overflow-y-auto pr-1">
                {isLoading && (
                    <p className="text-xs text-slate-400">Loading...</p>
                )}
                {!isLoading && comments.length === 0 && (
                    <p className="text-xs text-slate-400">No comments yet.</p>
                )}
                {comments.map((c) => (
                    <div key={c.id} className="flex gap-2.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600">
                            {initials(c.author_name, c.author_email)}
                        </span>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-xs font-semibold text-slate-800">
                                    {c.author_name ?? c.author_email ?? "Unknown"}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                    {timeAgo(c.created_at)}
                                </span>
                            </div>
                            <p className="mt-0.5 text-sm leading-snug text-slate-700">
                                {c.comment}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="flex items-end gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600">
                    {initials(user?.name ?? null, user?.email ?? "")}
                </span>
                <Textarea
                    value={text}
                    rows={1}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSubmit()
                        }
                    }}
                    placeholder="Add a comment…"
                    className="min-h-0 flex-1 resize-none text-sm"
                />
                <Button
                    size="icon"
                    variant="ghost"
                    disabled={!text.trim() || isPending}
                    onClick={handleSubmit}
                    className="h-8 w-8 shrink-0"
                >
                    <Send className="h-3.5 w-3.5" />
                </Button>
            </div>

            <p className="text-[10px] text-slate-400">
                Shift + Enter for new line
            </p>
        </div>
    )
}