
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { insertSubjectSchema } from "@shared/schema";
import type { Subject, Course } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/constants";
import { queryClient } from "@/lib/queryClient";
import { ImageUploader } from "@/components/shared/image-uploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SubjectFormProps {
  subject: Subject | null;
  onSuccess: () => void;
}

export function SubjectForm({ subject, onSuccess }: SubjectFormProps) {
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(insertSubjectSchema),
    defaultValues: subject || {
      subject_name: "",
      course_id: "",
      status: "Active",
      thumbnail: "",
    },
  });

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: [API_BASE_URL+"/api/list-courses"]
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(API_BASE_URL + (subject ? "/api/edit-subject" : "/api/create-subject"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subject ? { ...data, subject_id: subject.subject_id } : data),
      });
      if (!response.ok) throw new Error("Failed to save subject");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_BASE_URL+"/api/list-subjects"] });
      toast({ title: `Subject ${subject ? "updated" : "created"} successfully` });
      onSuccess();
      if (!subject) form.reset();
    },
    onError: () => {
      toast({ title: "Failed to save subject", variant: "destructive" });
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
          className="grid grid-cols-2 gap-4"
        >
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <ImageUploader
                      value={field.value}
                      onChange={field.onChange}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                <FormLabel>Course</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.course_id} value={course.course_id}>
                        {course.course_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2 flex justify-end">
            <Button type="submit" disabled={mutation.isPending}>
              {subject ? "Update" : "Create"} Subject
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
