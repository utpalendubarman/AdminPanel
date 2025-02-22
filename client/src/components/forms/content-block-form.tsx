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
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { insertContentBlockSchema, type ContentBlock } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ContentBlockFormProps {
  lessonId: string;
  block?: ContentBlock | null;
  onSuccess: () => void;
}

export function ContentBlockForm({ lessonId, block, onSuccess }: ContentBlockFormProps) {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertContentBlockSchema),
    defaultValues: block || {
      lesson_id: lessonId,
      order: 0,
      image_url: "",
      content: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      // This would be an API call in real implementation
      console.log("Saving content block:", data);
    },
    onSuccess: () => {
      toast({
        title: `Content block ${block ? "updated" : "created"} successfully`,
      });
      onSuccess();
    },
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {block ? "Edit Content Block" : "Create Content Block"}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
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
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    rows={6}
                    placeholder="Enter content here..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {block ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}