import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { SubjectForm } from "@/components/forms/subject-form";
import type { Subject } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";

export default function Subjects() {
  const [open, setOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const { data: subjects = [] } = useQuery({ 
    queryKey: ["/api/list-subjects"]
  });

  const columns: ColumnDef<Subject>[] = [
    {
      accessorKey: "subject_name",
      header: "Subject Name",
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
        const subject = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingSubject(subject);
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
