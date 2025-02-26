import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { Edit, Trash2, FolderOpen, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog } from "@/components/ui/dialog";
import type { Lesson } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { API_BASE_URL } from "@/lib/constants";
import { LessonForm } from "@/components/forms/lesson-form";
import { navigate } from "wouter/use-browser-location";

export default function Lessons() {
  const handleViewContents = async (lessonId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/list-contents?lesson_id=${lessonId}`
      );
      const data = await response.json();
  
      // Store data in sessionStorage or state (if using context)
      sessionStorage.setItem("lessonContents", JSON.stringify(data));
  
      // Redirect to CMS Dashboard
      navigate("/cms-dashboard");
    } catch (error) {
      console.error("Error fetching lesson contents:", error);
    }
  };
  
  const [open, setOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      await apiRequest("POST", API_BASE_URL + "/api/delete-lesson", {
        lesson_id: lessonId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_BASE_URL + "/api/list-lessons"],
      });
      toast({
        title: "Lesson deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error deleting lesson",
        description: error.message,
      });
    },
  });

  const { data: lessons = [] } = useQuery({
    queryKey: [API_BASE_URL + "/api/list-lessons"],
    queryFn: async () => {
      const response = await fetch(API_BASE_URL + "/api/list-lessons", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch lessons");
      }
      return response.json();
    },
  });

  const columns: ColumnDef<Lesson>[] = [
    {
      accessorKey: "lesson_name",
      header: "Lesson Name",
    },
    {
      accessorKey: "summary",
      header: "Lesson Summary",
    },
    {
      accessorKey: "thumbnail",
      header: "Image",
      cell: ({ row }) =>
        row.original.thumbnail ? (
          <img
            src={row.original.thumbnail}
            alt={row.original.lesson_name}
            className="w-16 h-16 object-cover rounded"
          />
        ) : null,
    },
    {
      accessorKey: "board",
      header: "Board",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const lesson = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingLesson(lesson);
                setOpen(true);
              }}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewContents(lesson.lesson_id)}
            >
              <FolderOpen className="h-4 w-4 mr-1" />
              Content
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this lesson?")
                ) {
                  deleteMutation.mutate(lesson.lesson_id);
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lessons</h1>
        <Button
          onClick={() => {
            setEditingLesson(null);
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Lesson
        </Button>
      </div>

      <DataTable columns={columns} data={lessons} searchKey="lesson_name" />

      <Dialog open={open} onOpenChange={setOpen}>
        <LessonForm
          lesson={editingLesson}
          onSuccess={() => {
            setOpen(false);
            setEditingLesson(null);
          }}
        />
      </Dialog>
    </div>
  );
}
