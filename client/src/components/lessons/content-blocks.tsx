import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ContentBlockForm } from "@/components/forms/content-block-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { ContentBlock } from "@shared/schema";

interface ContentBlocksProps {
  lessonId: string;
}

const dummyBlocks: ContentBlock[] = [
  {
    id: "1",
    lesson_id: "test-lesson",
    order: 1,
    image_url: "https://picsum.photos/200/300",
    content: "This is the first content block with some sample text for testing purposes.",
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    lesson_id: "test-lesson",
    order: 2,
    image_url: "https://picsum.photos/200/301",
    content: "This is another content block with different content to show multiple items.",
    created_at: new Date().toISOString()
  }
];

export function ContentBlocks({ lessonId }: ContentBlocksProps) {
  const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const columns = [
    {
      accessorKey: "order",
      header: "Order"
    },
    {
      accessorKey: "content",
      header: "Content"
    },
    {
      accessorKey: "created_at",
      header: "Created At"
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const block = row.original;
        return (
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedBlock(block)}
                >
                  Edit
                </Button>
              </DialogTrigger>
            </Dialog>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(block.id)}
            >
              Delete
            </Button>
          </div>
        );
      }
    }
  ];

  const handleDelete = async (blockId: string) => {
    // In real implementation, this would be an API call
    console.log("Deleting block:", blockId);
    toast({
      title: "Block deleted successfully",
    });
  };

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
        data={dummyBlocks}
        searchKey="content"
      />
    </div>
  );
}