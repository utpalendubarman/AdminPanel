
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ContentBlockForm } from "@/components/forms/content-block-form";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { API_BASE_URL } from "@/lib/constants";
import type { ContentBlock } from "@shared/schema";
import { useState } from "react";

interface ContentBlocksProps {
  lessonId: string;
}

export function ContentBlocks({ lessonId }: ContentBlocksProps) {
  const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: blocks = [] } = useQuery({
    queryKey: [`${API_BASE_URL}/api/list-content-blocks`, lessonId],
    queryFn: async () => {
      const response = await apiRequest("POST", `${API_BASE_URL}/api/list-content-blocks`, { lesson_id: lessonId });
      return response as ContentBlock[];
    },
  });

  const columns = [
    { header: "Order", accessorKey: "order" },
    { header: "Content", accessorKey: "content" },
    { header: "Image", accessorKey: "image_url" },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => {
            setSelectedBlock(row.original);
            setIsDialogOpen(true);
          }}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={async () => {
            await apiRequest("POST", `${API_BASE_URL}/api/delete-content-block`, { block_id: row.original.id });
          }}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Blocks</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedBlock(null)}>Add Content Block</Button>
          </DialogTrigger>
          <ContentBlockForm
            lessonId={lessonId}
            block={selectedBlock}
            onSuccess={() => setIsDialogOpen(false)}
          />
        </Dialog>
      </div>
      <DataTable
        columns={columns}
        data={blocks}
      />
    </div>
  );
}
