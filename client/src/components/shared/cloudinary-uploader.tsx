
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Image, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface CloudinaryUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
}

export function CloudinaryUploader({ value, onChange, className }: CloudinaryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/doog8iipa/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image');
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      setPreviewUrl(data.secure_url);
      onChange(data.secure_url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      uploadImage(file);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
        disabled={isUploading}
      />
      
      {previewUrl ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-full w-full object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleRemove}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full py-8"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <div className="flex flex-col items-center gap-2">
            <Image className="h-8 w-8 text-muted-foreground" />
            <div className="text-xs text-muted-foreground">
              Click to upload an image
            </div>
          </div>
        </Button>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 animate-bounce" />
            <span className="text-sm">Uploading...</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}
    </div>
  );
}
