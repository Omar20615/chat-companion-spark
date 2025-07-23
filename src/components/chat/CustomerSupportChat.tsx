import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { ChatService } from './ChatService';
import { ChatMessage, ChatConfig } from './types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CustomerSupportChatProps {
  config: ChatConfig;
}

export default function CustomerSupportChat({ config }: CustomerSupportChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatServiceRef = useRef<ChatService>();

  // Initialize chat service
  useEffect(() => {
    chatServiceRef.current = new ChatService(config);
    
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'bot',
      content: `Hello! I'm **${config.agentName}**, your customer support assistant. How can I help you today?`,
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
  }, [config]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async (userMessage: string) => {
    if (!chatServiceRef.current || isLoading) return;

    setError(null);
    setIsLoading(true);

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    // Add bot message placeholder for streaming
    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      type: 'bot',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMsg, botMsg]);

    let botResponse = '';

    try {
      await chatServiceRef.current.sendMessage(
        userMessage,
        messages,
        (chunk: string) => {
          botResponse += chunk;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === botMsg.id 
                ? { ...msg, content: botResponse, isStreaming: true }
                : msg
            )
          );
        },
        () => {
          // On complete
          setMessages(prev => 
            prev.map(msg => 
              msg.id === botMsg.id 
                ? { ...msg, isStreaming: false }
                : msg
            )
          );
          setIsLoading(false);
        },
        (error: Error) => {
          // On error
          console.error('Chat error:', error);
          setError(error.message);
          setMessages(prev => prev.filter(msg => msg.id !== botMsg.id));
          setIsLoading(false);
          
          toast({
            title: "Connection Error",
            description: "Failed to send message. Please try again.",
            variant: "destructive",
          });
        }
      );
    } catch (error) {
      console.error('Send message error:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
      setMessages(prev => prev.filter(msg => msg.id !== botMsg.id));
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    // Remove any failed/streaming messages
    setMessages(prev => prev.filter(msg => !msg.isStreaming));
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-background">
      <ChatHeader agentName={config.agentName} isOnline={!error} />
      
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-1">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {error && (
              <div className="flex items-center justify-center py-4">
                <div className="flex items-center space-x-2 text-destructive bg-destructive/10 px-4 py-2 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Connection error</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    className="ml-2"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Retry
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={!!error}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}