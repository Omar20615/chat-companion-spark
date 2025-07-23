import { ChatConfig, ChatMessage } from './types';

export class ChatService {
  private config: ChatConfig;
  private controller: AbortController | null = null;

  constructor(config: ChatConfig) {
    this.config = config;
  }

  async sendMessage(
    prompt: string, 
    chatHistory: ChatMessage[],
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    // Cancel any ongoing request
    if (this.controller) {
      this.controller.abort();
    }
    
    this.controller = new AbortController();

    try {
      const formData = new FormData();
      formData.append('user_id', this.config.userId);
      formData.append('conversation_id', this.config.conversationId);
      formData.append('prompt', prompt);
      formData.append('agent_name', this.config.agentName);
      
      // Convert chat history to the expected format
      const historyForApi = chatHistory
        .filter(msg => !msg.isStreaming)
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));
      
      formData.append('chat_history', JSON.stringify(historyForApi));

      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Accept': 'text/event-stream',
          'X-ML-Internal': 'true',
          'Authorization': `Bearer ${this.config.authToken}`,
        },
        body: formData,
        signal: this.controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          console.log('Received line:', line);
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            console.log('SSE data:', data);
            if (data === '[DONE]') {
              onComplete();
              return;
            }
            
            try {
              const parsed = JSON.parse(data);
              console.log('Parsed JSON:', parsed);
              if (parsed.content) {
                onChunk(parsed.content);
              }
            } catch (e) {
              // If it's not JSON, treat it as plain text
              console.log('Non-JSON data:', data);
              if (data.trim()) {
                onChunk(data);
              }
            }
          } else if (line.trim() && !line.startsWith(':')) {
            // Handle non-SSE formatted responses
            console.log('Non-SSE line:', line);
            onChunk(line);
          }
        }
      }
      
      onComplete();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Request was cancelled, don't treat as error
      }
      onError(error instanceof Error ? error : new Error('Unknown error occurred'));
    } finally {
      this.controller = null;
    }
  }

  cancelRequest(): void {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }
}