"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { usersData } from "@/dummy-data/usersData";
import { coursesData } from "@/dummy-data/coursesData";
import AppSearchBar from "@/components/AppSearchBar";

// --- DUMMY DATA FOR UI MOCKUP ---
const currentUser = usersData[0];
const course = coursesData[0];

export type CourseStudentInstructorListItem = {
  id: string;
  fullName: string;
  role: "student" | "instructor";
  status: "online" | "offline";
  lastMessage: string;
  avatar?: string | null;
};

const dummyCourseStudentInstructorList: CourseStudentInstructorListItem[] =
  usersData
    .filter((u) => u._id !== currentUser._id)
    .map((u) => ({
      id: u._id,
      fullName: u.fullName,
      role: u.role as "student" | "instructor",
      status: Math.random() > 0.5 ? "online" : "offline",
      lastMessage: "",
      avatar: u.avatar,
    }));

type Message = {
  id: string;
  content: string;
  sender: typeof currentUser | CourseStudentInstructorListItem;
  createdAt: string;
};

const staticMessages: Message[] = [
  {
    id: "1",
    content: "Hi, I had a question about the assignment.",
    sender: currentUser,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    content: "Sure, what's your question?",
    sender: dummyCourseStudentInstructorList[0],
    createdAt: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    id: "3",
    content: "I am having trouble understanding the concept in chapter 2.",
    sender: currentUser,
    createdAt: new Date(Date.now() - 3400000).toISOString(),
  },
  {
    id: "4",
    content:
      "Did you review the supplemental video material? It explains it perfectly.",
    sender: dummyCourseStudentInstructorList[0],
    createdAt: new Date(Date.now() - 3300000).toISOString(),
  },
  {
    id: "5",
    content: "Ah, I missed that! Thanks, I will check it out now.",
    sender: currentUser,
    createdAt: new Date(Date.now() - 3200000).toISOString(),
  },
];

// --- HELPER COMPONENTS ---

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

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
}

// --- SIDEBAR COMPONENT ---

function PrivateChatSidebar({
  courseStudentInstructorList,
  selectedCourseStudentInstructorId,
}: {
  courseStudentInstructorList: CourseStudentInstructorListItem[];
  selectedCourseStudentInstructorId: string;
}) {
  return (
    <div className="flex w-[320px] min-h-0 min-w-0 shrink-0 flex-col rounded-2xl border bg-card">
      <div className="flex gap-2 border-b p-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Go back"
          className="shrink-0 h-10 w-10"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="relative min-w-0 flex-1">
          <AppSearchBar placeholder="Search students or instructor..." />
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="min-w-0 space-y-2 p-3">
          {courseStudentInstructorList.map((courseStudentInstructor) => {
            const isSelected =
              courseStudentInstructor.id === selectedCourseStudentInstructorId;

            return (
              <button
                key={courseStudentInstructor.id}
                type="button"
                className={`grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)] items-start gap-3 overflow-hidden rounded-xl border px-3 py-3 text-left transition-colors ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-transparent hover:bg-muted/70"
                }`}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={courseStudentInstructor.avatar || undefined}
                      alt={toTitleCase(courseStudentInstructor.fullName)}
                    />
                    <AvatarFallback>
                      {getNameInitials(
                        toTitleCase(courseStudentInstructor.fullName),
                      )}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="min-w-0 overflow-hidden">
                  <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <p className="truncate font-medium">
                      {toTitleCase(courseStudentInstructor.fullName)}
                    </p>
                    <span className="shrink-0 text-xs capitalize text-muted-foreground">
                      {toTitleCase(courseStudentInstructor.role)}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

// --- PANEL COMPONENTS ---

const PrivateChatHeader = React.memo(function PrivateChatHeader({
  selectedCourseStudentInstructor,
}: {
  selectedCourseStudentInstructor: CourseStudentInstructorListItem;
}) {
  return (
    <div className="border-b p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={selectedCourseStudentInstructor.avatar || undefined}
              alt={selectedCourseStudentInstructor.fullName}
            />
            <AvatarFallback>
              {getNameInitials(selectedCourseStudentInstructor.fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">
              {selectedCourseStudentInstructor.fullName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {selectedCourseStudentInstructor.role === "instructor"
                ? "Instructor"
                : "Student"}{" "}
              • {course.title}
            </p>
          </div>
        </div>

        <div className="hidden text-right text-xs text-muted-foreground sm:block">
          <p>{course.title}</p>
          <p>
            {selectedCourseStudentInstructor.status === "online"
              ? "Online now"
              : "Last seen recently"}
          </p>
        </div>
      </div>
    </div>
  );
});

const PrivateChatFooter = React.memo(function PrivateChatFooter({
  newMessage,
  onMessageChange,
  onSendMessage,
  onKeyDown,
}: {
  newMessage: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="border-t p-4">
      <div className="flex items-end gap-2">
        <div className="min-w-0 flex-1">
          <Textarea
            placeholder="Type your private message here... (Shift + Enter for new line)"
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={onKeyDown}
            className="min-h-20 max-h-30 resize-none"
            rows={1}
          />
        </div>
        <div className="flex justify-center items-start h-20">
          <Button
            size="icon"
            onClick={onSendMessage}
            disabled={!newMessage.trim()}
            className="mb-1"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        This is a private chat between course students and the instructor
      </p>
    </div>
  );
});

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
        {messages.map((msg, i) => {
          const senderId = "_id" in msg.sender ? msg.sender._id : msg.sender.id;
          return (
            <div
              key={i}
              className={`flex gap-3 ${
                senderId === userId ? "justify-end" : "justify-start"
              }`}
            >
              {senderId !== userId && (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={msg.sender.avatar || undefined}
                    alt={msg.sender.fullName}
                  />
                  <AvatarFallback>
                    {getNameInitials(msg.sender.fullName)}
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 min-w-0 ${
                  senderId === userId
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm break-words whitespace-pre-wrap">
                  {msg.content}
                </p>
                <p
                  className={`mt-1 text-xs opacity-70 ${
                    senderId === userId ? "text-right" : "text-left"
                  }`}
                >
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>

              {senderId === userId && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={msg.sender.avatar || undefined} alt="You" />
                  <AvatarFallback>
                    {getNameInitials(msg.sender.fullName)}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
});

function PrivateChatPanel({
  selectedCourseStudentInstructor,
  messages,
  newMessage,
  onMessageChange,
  onSendMessage,
  onKeyDown,
}: {
  selectedCourseStudentInstructor: CourseStudentInstructorListItem;
  messages: Message[];
  newMessage: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) {
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

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col rounded-2xl border bg-background">
      <PrivateChatHeader
        selectedCourseStudentInstructor={selectedCourseStudentInstructor}
      />

      <ChatMessages
        messages={messages}
        scrollAreaRef={scrollAreaRef}
        userId={currentUser._id}
      />

      <PrivateChatFooter
        newMessage={newMessage}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}

// --- MAIN COMPONENT ---

export default function PrivateCourseChat() {
  const [newMessage, setNewMessage] = useState("");

  // Keep static dependencies
  const courseStudentInstructorList = dummyCourseStudentInstructorList;
  const selectedCourseStudentInstructor = courseStudentInstructorList[0];
  const messages = staticMessages;

  const handleSendMessage = () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) return;

    console.log("User submitted message:", trimmedMessage);
    setNewMessage(""); // Clear input, but don't add to messages
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[100vh] min-h-0 gap-4 bg-background p-3">
      <PrivateChatSidebar
        courseStudentInstructorList={courseStudentInstructorList}
        selectedCourseStudentInstructorId={selectedCourseStudentInstructor.id}
      />

      <PrivateChatPanel
        selectedCourseStudentInstructor={selectedCourseStudentInstructor}
        messages={messages}
        newMessage={newMessage}
        onMessageChange={setNewMessage}
        onSendMessage={handleSendMessage}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
