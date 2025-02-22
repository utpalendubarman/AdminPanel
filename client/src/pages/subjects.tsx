
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { SubjectForm } from "@/components/forms/subject-form";
import type { Subject } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { API_BASE_URL } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api-request";

export default function Subjects() {
  const [open, setOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const { toast } = useToast();

  const { data: subjects = [], refetch } = useQuery({ 
    queryKey: [API_BASE_URL+"/api/list-subjects"]
  });

  const handleDelete = async (subject: Subject) => {
    try {
      await apiRequest("POST", API_BASE_URL+"/api/delete-subject", {
        subject_id: subject.id,
      });
      toast({
        title: "Subject deleted successfully",
      });
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const columns: ColumnDef<Subject>[] = [
    {
      accessorKey: "subject_image",
      header: "Thumbnail",
      cell: ({ row }) => {
        const subject = row.original;
        return subject.subject_image ? (
          <img 
            src={subject.subject_image} 
            alt={subject.subject_name}
            className="w-12 h-12 object-cover rounded"
          />
        ) : null;
      },
    },
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
              size="icon"
              onClick={() => {
                setEditingSubject(subject);
                setOpen(true);
              }}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(subject)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
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
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <SubjectForm 
          subject={editingSubject}
          onSuccess={() => {
            setOpen(false);
            refetch();
          }}
        />
      </Dialog>
    </div>
  );
}
