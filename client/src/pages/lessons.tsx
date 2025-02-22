import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { LessonForm } from "@/components/forms/lesson-form";
import type { Lesson } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";

export default function Lessons() {
  const [open, setOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const { data: lessons = [] } = useQuery({ 
    queryKey: ["/api/list-lessons"]
  });

  const columns: ColumnDef<Lesson>[] = [
    {
      accessorKey: "lesson_name",
      header: "Lesson Name",
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
