import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { API_BASE_URL } from "@/lib/constants";
import { useRef, useEffect } from "react"; // Import useRef and useEffect
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
  

  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Create a reference

// Function to scroll to the bottom
const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

// Auto-scroll when messages update
useEffect(() => {
  scrollToBottom();
}, [messages]);


  const handleSend = async () => {
    if (!inputValue.trim()) return;
  
    // Add user message to the chat
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
  
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
  
    // Add a temporary "Typing..." message
    const typingMessage: Message = {
      id: "typing", // Unique ID to identify and replace later
      content: "Typing...",
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, typingMessage]);
  
    // Prepare API request data
    const requestData = {
      model_id: 6, // Dynamically set this if required
      lesson_id: selectedLesson?.id || "default_lesson_id",
      query: inputValue,
    };
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      const firstImage = data.res.images?.[0] || null; // Extract first image if available
  
      // Add the response message from the API
      const teacherResponse: Message & { image?: string } = {
        id: crypto.randomUUID(),
        content: data.res.response || "No response from server.",
        isUser: false,
        timestamp: new Date(),
        image: firstImage, // Attach image if available
      };
  
      // Remove "Typing..." message and add real response
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== "typing"),
        teacherResponse,
      ]);
    } catch (error) {
      console.error("Error fetching chat response:", error);
  
      // Remove "Typing..." message and add error message
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: "Failed to get a response. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
  
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== "typing"),
        errorMessage,
      ]);
    }
  };
  
  
  

  const [isTTSLoading, setIsTTSLoading] = useState(false); // State to track TTS loading

  const playTTS = async (text: string, voiceName = "en-IN-Chirp-HD-F") => {
    const apiKey = "AIzaSyB0nXo6uSyfSo19H730bATIOFmWhlV2ZHY";

    if (!apiKey) {
      console.error("Google TTS API key is missing.");
      return;
    }

    setIsTTSLoading(true); // Start loading

    const requestData = {
      input: { text },
      voice: { languageCode: "en-IN", name: voiceName, ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3" },
    };

    try {
      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error(`TTS request failed with status: ${response.status}`);
      }

      const data = await response.json();
      const audioUrl = `data:audio/mp3;base64,${data.audioContent}`;
      const audio = new Audio(audioUrl);

      audio.play();
      audio.onended = () => setIsTTSLoading(false); // Stop loading when audio ends
    } catch (error) {
      console.error("Error with Google TTS:", error);
      setIsTTSLoading(false);
    }
  };

  

  return (
    <div className="flex h-[calc(100vh-10rem)] overflow-hidden rounded-lg border bg-white">
      {/* Teacher Selection Sidebar */}
      <div className="w-80 border-r bg-muted/10">
        <div className="p-4 border-b">
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
                  {selectedTeacher.short_bio}
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
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  {!message.isUser && selectedTeacher && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={selectedTeacher.image} alt={selectedTeacher.name} />
                      <AvatarFallback>{selectedTeacher.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <p className="leading-relaxed">{message.content}</p>
                      {!message.isUser && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => playTTS(message.content,selectedTeacher.voice)}
                          className="h-6 w-6 p-0 -mt-1"
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {"image" in message && message.image && (
                      <div className="mt-2">
                        <img
                          src={message.image}
                          alt="Response Image"
                          className="rounded-lg max-w-xs border"
                        />
                      </div>
                    )}

                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {/* Empty div for scrolling reference */}
              <div ref={messagesEndRef}></div>
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
            <Button type="button" variant="ghost" size="icon" disabled={isTTSLoading}>
              {isTTSLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : (
                <Mic className="h-5 w-5 text-muted-foreground" />
              )}
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