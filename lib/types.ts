export type ChatStage =
  | "greeting"
  | "qualification"
  | "contact_request"
  | "consent_request"
  | "completed";

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export interface ConversationState {
  stage: ChatStage;
  messages: ChatMessage[];
  collectedData: CollectedData;
}

export interface CollectedData {
  name?: string;
  contact?: string;
  contactType?: "telegram" | "phone" | "unknown";
  request?: string;
  summary?: string;
  consentGiven?: boolean;
}

export interface LeadPayload {
  name: string;
  contact: string;
  contactType: string;
  request: string;
  summary: string;
  consentGiven: boolean;
  source: string;
  rawConversation: string;
}

export interface ChatApiRequest {
  messages: { role: string; content: string }[];
  stage: ChatStage;
  collectedData: CollectedData;
}

export interface ChatApiResponse {
  reply: string;
  stage: ChatStage;
  collectedData: CollectedData;
}

export interface QuickAction {
  label: string;
  message: string;
}
