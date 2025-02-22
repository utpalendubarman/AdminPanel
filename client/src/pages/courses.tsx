import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { CourseForm } from "@/components/forms/course-form";
import type { Course } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";

export default function Courses() {
  const [open, setOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const { data: courses = [] } = useQuery<Course[]>({ 
    queryKey: ["/api/list-courses"]
  });

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "course_name",
      header: "Course Name",
    },
    {
      accessorKey: "board_name",
      header: "Board",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const course = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingCourse(course);
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
        <h1 className="text-3xl font-bold">Courses</h1>
        <Button onClick={() => {
          setEditingCourse(null);
          setOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={courses}
        searchKey="course_name"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <CourseForm 
          course={editingCourse}
          onSuccess={() => setOpen(false)}
        />
      </Dialog>
    </div>
  );
}