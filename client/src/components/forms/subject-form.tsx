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
import { insertSubjectSchema, type Subject } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface SubjectFormProps {
  subject?: Subject | null;
  onSuccess: () => void;
}

export function SubjectForm({ subject, onSuccess }: SubjectFormProps) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertSubjectSchema),
    defaultValues: subject || {
      subject_name: "",
      subject_image: "",
      board: "",
      course_id: "",
      status: "Active",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof form.getValues) => {
      if (subject) {
        await apiRequest("POST", "/api/edit-subject", {
          subject_id: subject.id,
          ...data,
        });
      } else {
        await apiRequest("POST", "/api/create-subject", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/list-subjects"] });
      toast({
        title: `Subject ${subject ? "updated" : "created"} successfully`,
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
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {subject ? "Edit Subject" : "Create Subject"}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="subject_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject_image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject Image URL</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="course_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {subject ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}
