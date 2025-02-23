import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { SubjectForm } from "@/components/forms/subject-form";
import type { Subject } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { API_BASE_URL } from "@/lib/constants";

export default function Subjects() {
  const [open, setOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null); // Added deleteId state

  const { data: subjects = [] } = useQuery({ 
    queryKey: [API_BASE_URL+"/api/list-subjects"]
  });

  const columns: ColumnDef<Subject>[] = [
    {
      accessorKey: "thumbnail",
      header: "Thumbnail",
      cell: ({ row }) => (
        <div className="relative w-12 h-12 rounded overflow-hidden">
          <img 
            src={row.original.thumbnail} 
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
        <h1 className="text-3xl font-bold">Subjects</h1>
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
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <SubjectForm 
          subject={editingSubject}
          onSuccess={() => setOpen(false)}
        />
      </Dialog>
    </div>
  );
}