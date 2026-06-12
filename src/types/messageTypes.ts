export enum MessageTypeEnum {
  TEXT = "text",
  FILE = "file",
}

export interface MessageParticipant {
  id: string;
  fullName: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: MessageParticipant;
  receiver: MessageParticipant | null;
  content: string;
  messageType: MessageTypeEnum | string;
  createdAt: string;
  updatedAt: string;
}
