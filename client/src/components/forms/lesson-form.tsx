
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { insertLessonSchema, type Lesson, type Course, type Subject } from "@shared/schema";
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
    defaultValues: lesson || {
      lesson_name: "",
      board: "",
      status: "Active",
      subject_id: "",
      course_id: "",
      thumbnail: "",
    },
  });

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: [API_BASE_URL+"/api/list-courses"],
    queryFn: async () => {
      const response = await fetch(API_BASE_URL+"/api/list-courses", {
        credentials: 'include'
      });
      return response.json();
    }
  });

  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: [API_BASE_URL+"/api/list-subjects"],
    queryFn: async () => {
      const response = await fetch(API_BASE_URL+"/api/list-subjects", {
        credentials: 'include'
      });
      return response.json();
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof form.getValues) => {
      if (lesson) {
        await apiRequest("POST", API_BASE_URL+"/api/edit-lesson", {
          lesson_id: lesson.id,
          ...data,
        });
      } else {
        await apiRequest("POST", API_BASE_URL+"/api/create-lesson", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_BASE_URL+"/api/list-lessons"] });
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

  const boards = ['CBSE', 'ICSE', 'ISC', 'IGCSE', 'WBBSE'];
  const statuses = ['Active', 'Inactive'];

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {lesson ? "Edit Lesson" : "Create Lesson"}
        </DialogTitle>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courses.map((course) => (
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
            {lesson ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}
