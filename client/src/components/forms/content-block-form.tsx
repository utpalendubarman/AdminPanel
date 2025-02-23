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
import { Input } from "@/components/ui/input"; // Assuming Input component exists
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { insertContentBlockSchema, type ContentBlock } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";


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
      media_urls: [], // Added media_urls to defaultValues
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

  const handleImageUpload = async (files: FileList) => {
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'your_cloudinary_upload_preset'); // Replace with your actual preset

      const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', { // Replace with your actual Cloudinary cloud name
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      return data.secure_url;
    });

    const urls = await Promise.all(uploadPromises);
    const currentUrls = form.getValues('media_urls') || [];
    form.setValue('media_urls', [...currentUrls, ...urls]);
  };

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
          <FormField
            control={form.control}
            name="media_urls"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files!)}
                    />
                    <div className="grid grid-cols-3 gap-2">
                      {field.value?.map((url, index) => (
                        <div key={index} className="relative">
                          <img src={url} alt="" className="w-full h-24 object-cover rounded" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1"
                            onClick={() => {
                              const newUrls = field.value.filter((_, i) => i !== index);
                              form.setValue('media_urls', newUrls);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
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