export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatConfig {
  userId: string;
  conversationId: string;
  agentName: string;
  apiEndpoint: string;
  authToken: string;
}