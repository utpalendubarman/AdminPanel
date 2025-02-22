
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DataTable } from "@/components/shared/data-table";
import { ContentBlockForm } from "@/components/forms/content-block-form";
import type { ContentBlock } from "@shared/schema";
import { API_BASE_URL } from "@/lib/constants";
import { useToast } from "@/components/ui/use-toast";

interface ContentBlocksProps {
  lessonId: string;
}

// Dummy data for testing
const dummyBlocks: ContentBlock[] = [
  {
    id: "1",
    lesson_id: "test-lesson",
    order: 1,
    image_url: "https://picsum.photos/200/300",
    content: "This is an introduction to the lesson",
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    lesson_id: "test-lesson",
    order: 2,
    image_url: "https://picsum.photos/200/300",
    content: "This is the main content of the lesson",
    created_at: new Date().toISOString()
  }
];

export function ContentBlocks({ lessonId }: ContentBlocksProps) {
  const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use dummy data instead of API call for now
  const blocks = dummyBlocks;

  const deleteMutation = useMutation({
    mutationFn: async (blockId: string) => {
      // Simulate API call
      console.log("Deleting block:", blockId);
    },
    onSuccess: () => {
      toast({
        title: "Block deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["content-blocks"] });
    }
  });

  const columns = [
    {
      header: "Order",
      accessorKey: "order",
    },
    {
      header: "Preview",
      cell: ({ row }) => (
        <div className="flex flex-col gap-2">
          {row.original.image_url && (
            <img 
              src={row.original.image_url} 
              alt="Content preview" 
              className="w-20 h-20 object-cover rounded"
            />
          )}
          <p className="text-sm truncate max-w-[300px]">
            {row.original.content}
          </p>
        </div>
      ),
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedBlock(row.original);
              setIsDialogOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteMutation.mutate(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Content Blocks</h2>
          <p className="text-muted-foreground">
            Manage lesson content blocks
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedBlock(null)}>
              Add Content Block
            </Button>
          </DialogTrigger>
          <ContentBlockForm
            lessonId={lessonId}
            block={selectedBlock}
            onSuccess={() => {
              setIsDialogOpen(false);
              queryClient.invalidateQueries({ queryKey: ["content-blocks"] });
            }}
          />
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={blocks}
        searchKey="content"
      />
    </div>
  );
}
