import { useQuery } from "@tanstack/react-query";
import { ChatInterface } from "@/components/chat/chat-interface";
import type { Teacher, Lesson } from "@shared/schema";
import { API_BASE_URL } from "@/lib/constants";
export default function Conversations() {
  const { data: teachers = [] } = useQuery<Teacher[]>({ 
    queryKey: [API_BASE_URL+"/api/list-teachers"]
  });
  
  const { data: lessons = [] } = useQuery<Lesson[]>({ 
    queryKey: [API_BASE_URL+"/api/list-lessons"]
  });
 
  return (
    <div className="p-4">
      <div className="mb-3">
        <h3 className="text-3xl font-bold">AI Teacher Chat</h3>
      </div>
      <ChatInterface teachers={teachers} lessons={lessons} />
    </div>
  );
}
