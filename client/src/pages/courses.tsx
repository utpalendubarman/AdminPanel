import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CourseForm } from "@/components/forms/course-form";
import type { Course } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Courses() {
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  const { data: courses = [] } = useQuery<Course[]>({ 
    queryKey: ["/api/list-courses"]
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("POST", "/api/delete-course", { course_id: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/list-courses"] });
      toast({
        title: "Course deleted successfully",
      });
      setDeleteId(null);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
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
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-sm ${
          row.original.status === "Active" 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "thumbnail",
      header: "Thumbnail",
      cell: ({ row }) => (
        <div className="relative w-12 h-12 rounded overflow-hidden">
          <img 
            src={row.original.thumbnail} 
            alt={row.original.course_name}
            className="object-cover w-full h-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/48x48?text=No+Image";
            }}
          />
        </div>
      ),
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
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteId(course.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground mt-1">
            Manage your educational courses here
          </p>
        </div>
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
        pageSize={8}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <CourseForm 
          course={editingCourse}
          onSuccess={() => setOpen(false)}
        />
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              course.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                if (deleteId) {
                  deleteMutation.mutate(deleteId);
                }
              }}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}