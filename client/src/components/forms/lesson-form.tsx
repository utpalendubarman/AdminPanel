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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  insertLessonSchema,
  type Lesson,
  type Course,
  type Subject,
} from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { API_BASE_URL } from "@/lib/constants";

interface LessonFormProps {
  lesson?: Lesson | null;
  onSuccess: () => void;
}

export function LessonForm({ lesson, onSuccess }: LessonFormProps) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertLessonSchema),
    values: {
      lesson_name: lesson?.lesson_name || "",
      board: lesson?.board || "",
      status: lesson?.status || "Active",
      subject_id: lesson?.subject_id || "",
      course_id: lesson?.course_id || "",
      thumbnail: lesson?.thumbnail || "",
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!lesson) return;
      await apiRequest("POST", API_BASE_URL + "/api/delete-lesson", {
        lesson_id: lesson.lesson_id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_BASE_URL + "/api/list-lessons"],
      });
      toast({
        title: "Lesson deleted successfully",
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

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: [API_BASE_URL + "/api/list-courses"],
    queryFn: async () => {
      const response = await fetch(API_BASE_URL + "/api/list-courses", {
        credentials: "include",
      });
      return response.json();
    },
  });

  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: [API_BASE_URL + "/api/list-subjects"],
    queryFn: async () => {
      const response = await fetch(API_BASE_URL + "/api/list-subjects", {
        credentials: "include",
      });
      return response.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof form.getValues) => {
      if (lesson) {
        await apiRequest("POST", API_BASE_URL + "/api/edit-lesson", {
          lesson_id: lesson.lesson_id,
          ...data,
        });
      } else {
        await apiRequest("POST", API_BASE_URL + "/api/create-lesson", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_BASE_URL + "/api/list-lessons"],
      });
      toast({
        title: `Lesson ${lesson ? "updated" : "created"} successfully`,
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

  const boards = ["CBSE", "ICSE", "ISC", "IGCSE", "WBBSE"];
  const statuses = ["Active", "Inactive"];

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{lesson ? "Edit Lesson" : "Create Lesson"}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="grid grid-cols-2 gap-4"
        >
          <FormField
            control={form.control}
            name="lesson_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson Name</FormLabel>
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
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a board" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {boards.map((board) => (
                      <SelectItem key={board} value={board}>
                        {board}
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
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
            name="subject_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>

                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem
                        key={subject.subject_id}
                        value={subject.subject_name}
                      >
                        {subject.subject_name}
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
            name="course_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    
                    {courses.map((course) => (
                      <SelectItem
                        key={course.course_id}
                        value={course.course_name}
                      >
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
            name="thumbnail"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Thumbnail</FormLabel>
                <FormControl>
                  <ImageUpload value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-2 flex justify-between">
            <Button type="submit">{lesson ? "Update" : "Create"}</Button>
            {lesson && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this lesson?",
                    )
                  ) {
                    deleteMutation.mutate();
                  }
                }}
              >
                Delete
              </Button>
            )}
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
