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
import { insertCourseSchema, type Course, type InsertCourse } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface CourseFormProps {
  course?: Course | null;
  onSuccess: () => void;
}

export function CourseForm({ course, onSuccess }: CourseFormProps) {
  const { toast } = useToast();

  const form = useForm<InsertCourse>({
    resolver: zodResolver(insertCourseSchema),
    defaultValues: course || {
      course_name: "",
      board_name: "",
      status: "Active",
      thumbnail: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertCourse) => {
      if (course) {
        await apiRequest("POST", API_BASE_URL+"/api/edit-course", {
          course_id: course.course_id,
          ...data,
        });
      } else {
        await apiRequest("POST", API_BASE_URL+"/api/create-course", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_BASE_URL+"/api/list-courses"] });
      toast({
        title: `Course ${course ? "updated" : "created"} successfully`,
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
  const boards=['CBSE','ICSE','ISC','IGCSE','WBBSE']
  const statuses=['Active','Inactive']
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {course ? "Edit Course" : "Create Course"}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="grid grid-cols-2 gap-4" // Added grid layout for two columns
        >
          <FormField
            control={form.control}
            name="course_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="board_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Board Name</FormLabel>
                <FormControl>
                  <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
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
                  <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
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
          <Button type="submit" className="col-span-2"> {/* spans both columns */}
            {course ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}