
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/constants";
import { apiRequest } from "@/lib/api-request";
import { insertSubjectSchema, type Subject } from "@shared/schema";
import { useEffect, useState } from "react";
import { CloudinaryUploader } from "@/components/shared/cloudinary-uploader";

interface SubjectFormProps {
  subject?: Subject | null;
  onSuccess: () => void;
}

export function SubjectForm({ subject, onSuccess }: SubjectFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState("");

  const form = useForm({
    resolver: zodResolver(insertSubjectSchema),
    defaultValues: {
      subject_name: "",
      subject_image: "",
      board: "",
      course_id: "",
      status: "Active",
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
      setImageUrl(subject.subject_image);
    } else {
      form.reset({
        subject_name: "",
        subject_image: "",
        board: "",
        course_id: "",
        status: "Active",
      });
      setImageUrl("");
    }
  }, [subject, form]);

  const mutation = useMutation({
    mutationFn: async (data: typeof form.getValues) => {
      if (subject) {
        await apiRequest("POST", API_BASE_URL+"/api/edit-subject", {
          subject_id: subject.id,
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
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{subject ? "Edit" : "Create"} Subject</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-8">
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
              name="subject_image"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Subject Image</FormLabel>
                  <FormControl>
                    <CloudinaryUploader
                      value={imageUrl}
                      onChange={(url) => {
                        setImageUrl(url);
                        field.onChange(url);
                      }}
                    />
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
          </div>
          <Button type="submit" className="w-full">
            {subject ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}
