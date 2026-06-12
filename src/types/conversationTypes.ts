export enum ConversationTypeEnum {
  COURSE_PUBLIC = "coursePublicChat",
  PRIVATE_1V1 = "coursePrivateChat",
}

export interface Conversation {
  _id: string;
  conversationType: ConversationTypeEnum | string;
  course: string | null;
  privateChatConversationId: string | null;
  participants: string[];
  createdAt: string;
  updatedAt: string;
}
