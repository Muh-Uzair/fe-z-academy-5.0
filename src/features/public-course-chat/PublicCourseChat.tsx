"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { usersData } from "@/dummy-data/usersData";
import { coursesData } from "@/dummy-data/coursesData";

// --- DUMMY DATA FOR UI MOCKUP ---
const currentUser = usersData[0];
const course = coursesData[0];
// --- HELPER COMPONENTS ---

type Message = {
  id: string;
  content: string;
  sender: typeof currentUser;
  createdAt: string;
};

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Welcome to the public discussion!",
    sender: usersData[5],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    content: "Excited to start learning.",
    sender: usersData[1],
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "3",
    content: "Can anyone help me with chapter 2?",
    sender: currentUser,
    createdAt: new Date(Date.now() - 900000).toISOString(),
  },
];

function formatMessageTime(isoString: string) {
  return new Date(isoString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getNameInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

const ChatMessages = React.memo(function ChatMessages({
  messages,
  scrollAreaRef,
  userId,
}: {
  messages: Message[];
  scrollAreaRef: React.RefObject<HTMLDivElement | null>;
  userId: string;
}) {
  return (
    <ScrollArea ref={scrollAreaRef} className="min-h-0 flex-1 px-4 py-6">
      <div className="space-y-6 min-h-[80%]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${
              msg.sender._id === userId ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender._id !== userId && (
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={String(msg.sender.avatar)}
                  alt={msg.sender.fullName}
                />
                <AvatarFallback>
                  {getNameInitials(msg.sender.fullName)}
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 min-w-0 ${
                msg.sender._id === userId
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm break-words whitespace-pre-wrap">
                {msg.content}
              </p>
              <p
                className={`mt-1 text-xs opacity-70 ${
                  msg.sender._id === userId ? "text-right" : "text-left"
                }`}
              >
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>

            {msg.sender._id === userId && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={String(msg.sender.avatar)} alt="You" />
                <AvatarFallback>
                  {getNameInitials(msg.sender.fullName)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
});

const ChatInput = React.memo(function ChatInput({
  newMessage,
  onChange,
  onKeyDown,
  onSend,
}: {
  newMessage: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
}) {
  return (
    <div className="border-t p-4">
      <div className="flex gap-2 w-full">
        <div className="w-full">
          <Textarea
            placeholder="Type your message here... (Shift + Enter for new line)"
            value={newMessage}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            className="min-h-20 max-h-30 resize-none"
            rows={1}
          />
        </div>
        <div className="flex items-start">
          <Button
            size="icon"
            onClick={onSend}
            disabled={!newMessage.trim()}
            className="mb-1"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Everyone in this course can see these messages
      </p>
    </div>
  );
});

// --- MAIN COMPONENT ---

export default function PublicCourseChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    requestAnimationFrame(() => {
      const viewport = scrollAreaRef.current?.querySelector(
        "[data-slot='scroll-area-viewport']",
      ) as HTMLDivElement | null;

      if (!viewport) return;

      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior,
      });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: newMessage,
        sender: currentUser,
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewMessage("");
    scrollToBottom();
  }, [newMessage, scrollToBottom]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  return (
    <div className="flex flex-col flex-1 border rounded-xl overflow-hidden bg-background shadow-sm h-[600px] min-h-0 m-3">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="font-semibold">{course.title}</h2>
              <p className="text-sm text-muted-foreground">
                Public Discussion • {course.instructorName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ChatMessages
        messages={messages}
        scrollAreaRef={scrollAreaRef}
        userId={currentUser._id}
      />

      <ChatInput
        newMessage={newMessage}
        onChange={setNewMessage}
        onKeyDown={handleKeyDown}
        onSend={handleSendMessage}
      />
    </div>
  );
}
