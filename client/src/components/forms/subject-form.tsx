
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
import { insertSubjectSchema, type Subject, type InsertSubject, type Course } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
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
      subject_image: "",
      board: "",
      course_id: "",
      status: "Active",
    },
  });

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: [API_BASE_URL+"/api/list-courses"],
    queryFn: async () => {
      const response = await apiRequest("GET", API_BASE_URL+"/api/list-courses");
      return response.json();
    },
  });

  useEffect(() => {
    if (subject) {
      form.reset({
        subject_name: subject.subject_name,
        subject_image: subject.subject_image,
        board: subject.board,
        course_id: subject.course_id,
        status: subject.status,
      });
    } else {
      form.reset({
        subject_name: "",
        subject_image: "",
        board: "",
        course_id: "",
        status: "Active",
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

  const boards = ['CBSE', 'ICSE', 'ISC', 'IGCSE', 'WBBSE'];
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
                <FormLabel>Course</FormLabel>
                <FormControl>
                  <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.course_id} value={course.course_id}>
                        {course.course_name}
                      </option>
                    ))}
                  </select>
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
                  <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select Board</option>
                    {boards.map(board => (
                      <option key={board} value={board}>{board}</option>
                    ))}
                  </select>
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
            name="subject_image"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Image</FormLabel>
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
