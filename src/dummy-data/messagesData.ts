import { type Message, MessageTypeEnum } from "@/types/messageTypes";

export const messagesData: Message[] = [
  {
    _id: "msg_001",
    conversation: "conv_001",
    sender: {
      id: "user_001",
      fullName: "User 1 Fullname",
    },
    receiver: null,
    content: "Hello everyone, I just started this course!",
    messageType: MessageTypeEnum.TEXT,
    createdAt: "2026-06-01T09:05:00Z",
    updatedAt: "2026-06-01T09:05:00Z",
  },
  {
    _id: "msg_002",
    conversation: "conv_001",
    sender: {
      id: "user_006",
      fullName: "User 6 Fullname",
    },
    receiver: null,
    content: "Welcome! Feel free to ask any questions here.",
    messageType: MessageTypeEnum.TEXT,
    createdAt: "2026-06-01T09:10:00Z",
    updatedAt: "2026-06-01T09:10:00Z",
  },
];
