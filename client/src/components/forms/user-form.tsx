import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { insertUserSchema, type User } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { User as UserIcon, Mail, Phone, School, Layout, GraduationCap, Image } from "lucide-react";

interface UserFormProps {
  user?: User | null;
  onSuccess: () => void;
}

export function UserForm({ user, onSuccess }: UserFormProps) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: user || {
      name: "",
      type: "",
      email: "",
      phone: "",
      school: "",
      board: "",
      class_id: "",
      profile_photo: ""
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof form.getValues) => {
      if (user) {
        await apiRequest("POST", "/api/edit-user", {
          identifier: user.id,
          ...data,
        });
      } else {
        await apiRequest("POST", "/api/create-user", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/list-users"] });
      toast({
        title: `User ${user ? "updated" : "created"} successfully`,
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  return (
    <DialogContent className="max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          {user ? "Edit User" : "Create User"}
        </DialogTitle>
      </DialogHeader>
      <ScrollArea className="flex-1">
        <div className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Layout className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input type="email" className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input type="tel" className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <School className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="board"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Board</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <GraduationCap className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="class_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Layout className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profile_photo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Photo URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Image className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                {user ? "Update" : "Create"}
              </Button>
            </form>
          </Form>
        </div>
      </ScrollArea>
    </DialogContent>
  );
}