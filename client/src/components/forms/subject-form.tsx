
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { insertSubjectSchema, type Subject, type InsertSubject } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useEffect } from "react";

interface SubjectFormProps {
  subject?: Subject | null;
  onSuccess: () => void;
}

export function SubjectForm({ subject, onSuccess }: SubjectFormProps) {
  const { toast } = useToast();

  const form = useForm<InsertSubject>({
    resolver: zodResolver(insertSubjectSchema),
    defaultValues: {
      subject_name: "",
      course_id: "",
      status: "Active",
      thumbnail: "",
    },
  });

  useEffect(() => {
    if (subject) {
      form.reset({
        subject_name: subject.subject_name,
        course_id: subject.course_id,
        status: subject.status,
        thumbnail: subject.thumbnail,
      });
    } else {
      form.reset({
        subject_name: "",
        course_id: "",
        status: "Active",
        thumbnail: "",
      });
    }
  }, [subject, form]);

  const mutation = useMutation({
    mutationFn: async (data: InsertSubject) => {
      if (subject) {
        await apiRequest("POST", API_BASE_URL+"/api/edit-subject", {
          subject_id: subject.subject_id,
          ...data,
        });
      } else {
        await apiRequest("POST", API_BASE_URL+"/api/create-subject", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_BASE_URL+"/api/list-subjects"] });
      toast({
        title: `Subject ${subject ? "updated" : "created"} successfully`,
      });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const statuses = ['Active', 'Inactive'];

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {subject ? "Edit Subject" : "Create Subject"}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="grid grid-cols-2 gap-4"
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
                  <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select Status</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Thumbnail</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="col-span-2">
            {subject ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}
