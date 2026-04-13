"use client"

import { useAddMember } from "@/features/addMembers/hooks"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { AddMemberFormInput, addMemberFormSchema } from "@/features/addMembers/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams } from "next/navigation"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"


export function AddMembers() {
  const { orgId } = useParams<{ orgId: string }>();
  const memberMutation = useAddMember();

  const form = useForm<AddMemberFormInput>({
  resolver: zodResolver(addMemberFormSchema),
  defaultValues: {
    email: "",
    userId: "",   
    role: "member"
  }
});
  const onSubmit = async (data: AddMemberFormInput) => {
  console.log("SUBMIT HIT", data);

  const payload = {
    email: data.email ?? undefined,
    userId:
      data.userId === "" || data.userId === undefined
        ? undefined
        : Number(data.userId),
    role: data.role ?? "member" as "member" | "admin",
  };

  await memberMutation.mutateAsync({ data: payload, orgId });
};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>+ Add Member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter the email of the user to be added" type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>


          )} />

        <FormField
          name="userId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                userId
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter the userId of the user to be added(optional if email provided)" type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>

          )} />
        <FormField
          name="role"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>

              </Select>
              <FormMessage />
              {memberMutation.isError && 
              <p className="text-sm text-destructive">{memberMutation.error.message}</p>}
            </FormItem>

      )} />
      <Button type="submit" disabled={memberMutation.isPending}>
        {memberMutation.isPending ? "Adding..." : "Add Member"}

      </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

