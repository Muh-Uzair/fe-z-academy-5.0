"use client";

import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import AppSearchBar from "@/components/AppSearchBar";

// --- STATIC DATA ---
const staticUsers = [
  {
    id: "1",
    fullName: "Alice Johnson",
    role: "Instructor",
    avatar: "",
    initials: "AJ",
  },
  {
    id: "2",
    fullName: "Bob Smith",
    role: "Student",
    avatar: "",
    initials: "BS",
  },
  {
    id: "3",
    fullName: "Carol White",
    role: "Student",
    avatar: "",
    initials: "CW",
  },
  {
    id: "4",
    fullName: "David Brown",
    role: "Student",
    avatar: "",
    initials: "DB",
  },
  {
    id: "5",
    fullName: "Emma Davis",
    role: "Student",
    avatar: "",
    initials: "ED",
  },
];

const staticMessages = [
  {
    id: "1",
    content: "Hi, I had a question about the assignment.",
    isOwn: true,
    time: "10:00 AM",
    avatar: "",
    initials: "ME",
  },
  {
    id: "2",
    content: "Sure, what's your question?",
    isOwn: false,
    time: "10:02 AM",
    avatar: "",
    initials: "AJ",
  },
  {
    id: "3",
    content: "I am having trouble understanding the concept in chapter 2.",
    isOwn: true,
    time: "10:05 AM",
    avatar: "",
    initials: "ME",
  },
  {
    id: "4",
    content:
      "Did you review the supplemental video material? It explains it perfectly.",
    isOwn: false,
    time: "10:07 AM",
    avatar: "",
    initials: "AJ",
  },
  {
    id: "5",
    content: "Ah, I missed that! Thanks, I will check it out now.",
    isOwn: true,
    time: "10:09 AM",
    avatar: "",
    initials: "ME",
  },
];

// --- SINGLE COMPONENT ---
export default function PrivateCourseChat() {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;
    console.log("User submitted message:", trimmed);
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[100vh] gap-4 bg-background p-4">
      {/* ── SIDEBAR ── */}
      <div className="flex w-[300px] shrink-0 flex-col rounded-2xl border bg-card">
        {/* Sidebar Header */}
        <div className="flex items-center gap-2 border-b p-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <AppSearchBar placeholder="Search..." />
          </div>
        </div>

        {/* Sidebar User List */}
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-3">
            {staticUsers.map((user, i) => (
              <div
                key={user.id}
                className={`flex items-center gap-3 rounded-xl border px-3 py-3 cursor-pointer transition-colors ${
                  i === 0
                    ? "border-primary bg-primary/10"
                    : "border-transparent hover:bg-muted/70"
                }`}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={user.avatar} alt={user.fullName} />
                  <AvatarFallback>{user.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">
                      {user.fullName}
                    </p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* ── CHAT PANEL ── */}
      <div className="flex flex-1 flex-col rounded-2xl border bg-background min-w-0">
        {/* Chat Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt="Alice Johnson" />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">Alice Johnson</h2>
                <p className="text-sm text-muted-foreground">
                  Instructor • Introduction to React
                </p>
              </div>
            </div>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Online now
            </p>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 min-h-0 px-4 py-6">
          <div className="space-y-6">
            {staticMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.isOwn ? "justify-end" : "justify-start"}`}
              >
                {!msg.isOwn && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={msg.avatar} alt="User" />
                    <AvatarFallback>{msg.initials}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] min-w-0 rounded-2xl px-4 py-3 ${
                    msg.isOwn
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm break-words whitespace-pre-wrap">
                    {msg.content}
                  </p>
                  <p
                    className={`mt-1 text-xs opacity-70 ${msg.isOwn ? "text-right" : "text-left"}`}
                  >
                    {msg.time}
                  </p>
                </div>
                {msg.isOwn && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={msg.avatar} alt="You" />
                    <AvatarFallback>{msg.initials}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="border-t p-4">
          <div className="flex items-start gap-2">
            <Textarea
              placeholder="Type your private message here... (Shift + Enter for new line)"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[80px] resize-none"
              rows={1}
            />

            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="h-10 w-10"
            >
              <Send />
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            This is a private chat between course students and the instructor
          </p>
        </div>
      </div>
    </div>
  );
}
