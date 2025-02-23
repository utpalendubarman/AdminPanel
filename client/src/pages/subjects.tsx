
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
import { SubjectForm } from "@/components/forms/subject-form";
import type { Subject, Course } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { API_BASE_URL } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Subjects() {
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const { toast } = useToast();

  const { data: subjects = [] } = useQuery<Subject[]>({ 
    queryKey: [API_BASE_URL+"/api/list-subjects"]
  });

  const deleteMutation = useMutation({
    mutationFn: async (subject_id: string) => {
      const response = await fetch(API_BASE_URL+"/api/delete-subject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject_id }),
      });
      if (!response.ok) throw new Error("Failed to delete subject");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_BASE_URL+"/api/list-subjects"] });
      toast({ title: "Subject deleted successfully" });
      setDeleteId(null);
    },
    onError: () => {
      toast({ title: "Failed to delete subject", variant: "destructive" });
    },
  });

  const columns: ColumnDef<Subject>[] = [
    {
      accessorKey: "thumbnail",
      header: "Thumbnail",
      cell: ({ row }) => (
        <div className="relative w-12 h-12 rounded overflow-hidden">
          <img 
            src={row.original.thumbnail || "https://placehold.co/48x48?text=No+Image"} 
            alt={row.original.subject_name}
            className="object-cover w-full h-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/48x48?text=No+Image";
            }}
          />
        </div>
      ),
    },
    {
      accessorKey: "subject_name",
      header: "Subject Name",
    },
    {
      accessorKey: "course_id",
      header: "Course ID",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setEditingSubject(row.original);
              setOpen(true);
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(row.original.subject_id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Subjects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your educational subjects here
          </p>
        </div>
        <Button onClick={() => {
          setEditingSubject(null);
          setOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Subject
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={subjects}
        searchKey="subject_name"
        pageSize={8}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <SubjectForm 
          subject={editingSubject}
          onSuccess={() => setOpen(false)}
        />
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the subject.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteMutation.mutate(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
