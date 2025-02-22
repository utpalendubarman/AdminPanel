import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { TeacherForm } from "@/components/forms/teacher-form";
import type { Teacher } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";

export default function Teachers() {
  const [open, setOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const { data: teachers = [] } = useQuery({ 
    queryKey: ["/api/list-teachers"]
  });

  const columns: ColumnDef<Teacher>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "voice",
      header: "Voice",
    },
    {
      accessorKey: "short_bio",
      header: "Short Bio",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const teacher = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingTeacher(teacher);
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
        <h1 className="text-3xl font-bold">Teachers</h1>
        <Button onClick={() => {
          setEditingTeacher(null);
          setOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={teachers}
        searchKey="name"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <TeacherForm 
          teacher={editingTeacher}
          onSuccess={() => setOpen(false)}
        />
      </Dialog>
    </div>
  );
}
