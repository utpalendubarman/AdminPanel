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
import { ImageUpload } from "@/components/ui/image-upload";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { insertSubjectSchema, type Subject } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubjectFormProps {
  onSuccess?: () => void;
  subject?: Subject;
}

export function SubjectForm({ onSuccess, subject }: SubjectFormProps) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertSubjectSchema),
    defaultValues: {
      subject_name: subject?.subject_name ?? "",
      course_id: subject?.course_id ?? "",
      thumbnail_url: subject?.thumbnail_url ?? "",
    },
  });

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: () => apiRequest("/api/courses").then((res) => res.json()),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: Subject) => {
      if (subject) {
        return apiRequest(`/api/subjects/${subject.id}`, {
          method: "PUT",
          body: JSON.stringify(values),
        });
      }
      return apiRequest("/api/subjects", {
        method: "POST",
        body: JSON.stringify(values),
      });
    },
    onSuccess: () => {
      toast({
        title: subject ? "Subject updated" : "Subject created",
        description: subject
          ? "The subject has been updated successfully"
          : "The subject has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      onSuccess?.();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{subject ? "Edit Subject" : "Create Subject"}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => mutate(values))}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses?.map((course: any) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.course_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="thumbnail_url"
            render={({ field }) => (
              <FormItem>
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

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Loading..." : subject ? "Update Subject" : "Create Subject"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}