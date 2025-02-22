import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { UserForm } from "@/components/forms/user-form";
import type { User } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";

export default function Users() {
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data: users = [] } = useQuery({ 
    queryKey: ["/api/list-users"]
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "school",
      header: "School",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingUser(user);
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
        <h1 className="text-3xl font-bold">Users</h1>
        <Button onClick={() => {
          setEditingUser(null);
          setOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchKey="name"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <UserForm 
          user={editingUser}
          onSuccess={() => setOpen(false)}
        />
      </Dialog>
    </div>
  );
}
