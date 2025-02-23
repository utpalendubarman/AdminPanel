import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { LessonForm } from "@/components/forms/lesson-form";
import type { Lesson } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { API_BASE_URL } from "@/lib/constants";

export default function Lessons() {
  const [open, setOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const { data: lessons = [] } = useQuery({ 
    queryKey: [API_BASE_URL+"/api/list-lessons"],
    queryFn: async () => {
      const response = await fetch(API_BASE_URL+"/api/list-lessons", {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch lessons');
      }
      return response.json();
    }
  });

  const columns: ColumnDef<Lesson>[] = [
    {
      accessorKey: "lesson_name",
      header: "Lesson Name",
    },
    {
      accessorKey: "thumbnail",
      header: "Image",
      cell: ({ row }) => row.original.thumbnail ? (
        <img src={row.original.thumbnail} alt={row.original.lesson_name} className="w-16 h-16 object-cover rounded" />
      ) : null
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
      cell: ({ row }) => {
        const lesson = row.original;
        const deleteMutation = useMutation({
          mutationFn: async () => {
            await apiRequest("POST", API_BASE_URL+"/api/delete-lesson", { lesson_id: lesson.id });
          },
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_BASE_URL+"/api/list-lessons"] });
            toast({
              title: "Lesson deleted successfully",
            });
          },
        });

        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingLesson(lesson);
                setOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = `/lessons/${row.original.id}/content`}
            >
              Content Blocks
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this lesson?')) {
                  deleteMutation.mutate();
                }
              }}
            >
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
        <Button onClick={() => {
          setEditingLesson(null);
          setOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Lesson
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={lessons}
        searchKey="lesson_name"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <LessonForm 
          lesson={editingLesson}
          onSuccess={() => setOpen(false)}
        />
      </Dialog>
    </div>
  );
}
