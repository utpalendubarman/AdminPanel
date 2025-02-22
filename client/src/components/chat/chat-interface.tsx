import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Volume2 } from "lucide-react";
import type { Teacher, Lesson } from "@shared/schema";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  teachers: Teacher[];
  lessons: Lesson[];
}

export function ChatInterface({ teachers, lessons }: ChatInterfaceProps) {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    // Simulate teacher response
    const teacherResponse: Message = {
      id: crypto.randomUUID(),
      content: `This is a simulated response from ${selectedTeacher?.name || 'the teacher'}.`,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, teacherResponse]);
    setInputValue("");
  };

  const playTTS = (text: string) => {
    // In a real implementation, this would call a TTS service
    console.log("Playing TTS:", text);
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] overflow-hidden rounded-lg border">
      {/* Teacher Selection Sidebar */}
      <div className="w-64 border-r bg-muted/10">
        <div className="p-4 border-b">
          <h3 className="font-semibold mb-4">Select Teacher</h3>
          <div className="space-y-2">
            {teachers.map(teacher => (
              <button
                key={teacher.id}
                onClick={() => setSelectedTeacher(teacher)}
                className={`flex items-center space-x-3 w-full p-2 rounded hover:bg-accent transition-colors ${
                  selectedTeacher?.id === teacher.id ? 'bg-accent' : ''
                }`}
              >
                <Avatar>
                  <AvatarImage src={teacher.image} alt={teacher.name} />
                  <AvatarFallback>{teacher.name[0]}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="font-medium">{teacher.name}</div>
                  <div className="text-xs text-muted-foreground">{teacher.short_bio}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Lesson Selection Header */}
        <div className="p-4 border-b">
          <Select
            value={selectedLesson?.id}
            onValueChange={(value) => {
              const lesson = lessons.find(l => l.id === value);
              setSelectedLesson(lesson || null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a lesson" />
            </SelectTrigger>
            <SelectContent>
              {lessons.map(lesson => (
                <SelectItem key={lesson.id} value={lesson.id}>
                  {lesson.lesson_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <p>{message.content}</p>
                    {!message.isUser && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => playTTS(message.content)}
                        className="h-6 w-6 p-0"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit">Send</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
