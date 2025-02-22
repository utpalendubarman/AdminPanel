import { useQuery } from "@tanstack/react-query";
import { ChatInterface } from "@/components/chat/chat-interface";
import type { Teacher, Lesson } from "@shared/schema";

export default function Conversations() {
  const { data: teachers = [] } = useQuery<Teacher[]>({ 
    queryKey: ["/api/list-teachers"]
  });
  
  const { data: lessons = [] } = useQuery<Lesson[]>({ 
    queryKey: ["/api/list-lessons"]
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Teacher Chat</h1>
        <p className="text-muted-foreground mt-1">
          Chat with AI teachers and evaluate their performance
        </p>
      </div>

      <ChatInterface teachers={teachers} lessons={lessons} />
    </div>
  );
}
