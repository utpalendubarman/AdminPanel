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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Volume2, 
  Settings, 
  Send,
  ImageIcon,
  Paperclip,
  Smile,
  Mic,
} from "lucide-react";
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
  const [showSettings, setShowSettings] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Play send message sound
    const audio = new Audio("https://cdn.pixabay.com/download/audio/2021/08/04/audio_46cecae684.mp3");
    audio.play();

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
      content: `This is a simulated response from ${selectedTeacher?.name || 'the teacher'}. The response will include the lesson context from "${selectedLesson?.lesson_name || 'selected lesson'}" once integrated with the AI backend.`,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, teacherResponse]);
    setInputValue("");
  };

  const playTTS = (text: string) => {
    // In a real implementation, this would call a TTS service
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] overflow-hidden rounded-lg border bg-white">
      {/* Teacher Selection Sidebar */}
      <div className="w-80 border-r bg-muted/10">
        <div className="p-4 border-b">
          <h3 className="font-semibold mb-4">AI Teachers</h3>
          <div className="space-y-2">
            {teachers.map(teacher => (
              <button
                key={teacher.id}
                onClick={() => {
                  setSelectedTeacher(teacher);
                  // Add greeting message when selecting a teacher
                  if (!messages.length) {
                    setMessages([{
                      id: crypto.randomUUID(),
                      content: teacher.greeting_messages || `Hello! I'm ${teacher.name}. I'll be helping you learn today.`,
                      isUser: false,
                      timestamp: new Date()
                    }]);
                  }
                }}
                className={`flex items-center space-x-3 w-full p-2 rounded hover:bg-accent transition-colors ${
                  selectedTeacher?.id === teacher.id ? 'bg-accent' : ''
                }`}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={teacher.image} alt={teacher.name} />
                  <AvatarFallback>{teacher.name[0]}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="font-medium">{teacher.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{teacher.short_bio}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedTeacher && (
              <Avatar>
                <AvatarImage src={selectedTeacher.image} alt={selectedTeacher.name} />
                <AvatarFallback>{selectedTeacher.name[0]}</AvatarFallback>
              </Avatar>
            )}
            <div>
              <h3 className="font-semibold">
                {selectedTeacher?.name || "Select a Teacher"}
              </h3>
              {selectedTeacher && (
                <p className="text-sm text-muted-foreground">
                  {selectedTeacher.voice} Voice
                </p>
              )}
            </div>
          </div>

          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Chat Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Lesson</label>
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
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isUser && selectedTeacher && (
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={selectedTeacher.image} alt={selectedTeacher.name} />
                    <AvatarFallback>{selectedTeacher.name[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <p className="leading-relaxed">{message.content}</p>
                    {!message.isUser && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => playTTS(message.content)}
                        className="h-6 w-6 p-0 -mt-1"
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
            className="flex items-center gap-2"
          >
            <Button type="button" variant="ghost" size="icon">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button type="button" variant="ghost" size="icon">
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="button" variant="ghost" size="icon">
              <Smile className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button type="button" variant="ghost" size="icon">
              <Mic className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button type="submit" size="icon">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}