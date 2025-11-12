export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  context?: any;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  extendscript_commands: string[];
  metadata: any;
}

