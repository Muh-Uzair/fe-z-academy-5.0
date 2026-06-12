import { type Conversation, ConversationTypeEnum } from "@/types/conversationTypes";

export const conversationsData: Conversation[] = [
  {
    _id: "conv_001",
    conversationType: ConversationTypeEnum.COURSE_PUBLIC,
    course: "course_001",
    privateChatConversationId: null,
    participants: ["user_001", "user_002", "user_006"],
    createdAt: "2026-06-01T09:00:00Z",
    updatedAt: "2026-06-05T14:20:00Z",
  },
  {
    _id: "conv_002",
    conversationType: ConversationTypeEnum.PRIVATE_1V1,
    course: null,
    privateChatConversationId: "private_001_006",
    participants: ["user_001", "user_006"],
    createdAt: "2026-06-03T15:00:00Z",
    updatedAt: "2026-06-04T10:15:00Z",
  },
];
