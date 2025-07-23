import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from './types';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble = memo(({ message }: MessageBubbleProps) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={cn(
      "flex w-full mb-4 animate-in slide-in-from-bottom-2 duration-300",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] min-w-[120px] rounded-2xl px-4 py-3 shadow-soft transition-all duration-300 hover:shadow-medium",
        isUser 
          ? "bg-gradient-message text-chat-user-text rounded-br-md" 
          : "bg-chat-bot-bubble text-chat-bot-text rounded-bl-md border border-border"
      )}>
        <div className={cn(
          "prose prose-sm max-w-none",
          isUser ? "prose-invert" : "prose-slate",
          "prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1",
          "prose-img:rounded-lg prose-img:shadow-soft prose-img:my-2",
          "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
          isUser && "prose-a:text-primary-light"
        )}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ node, ...props }) => (
                <img 
                  {...props} 
                  className="max-w-full h-auto rounded-lg shadow-soft my-2"
                  loading="lazy"
                />
              ),
              a: ({ node, ...props }) => (
                <a 
                  {...props} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={cn(
                    "font-medium transition-colors duration-200",
                    isUser ? "text-primary-light hover:text-white" : "text-primary hover:text-primary-dark"
                  )}
                />
              ),
              p: ({ node, ...props }) => (
                <p {...props} className="leading-relaxed" />
              )
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        
        <div className={cn(
          "text-xs mt-2 opacity-70",
          isUser ? "text-chat-user-text" : "text-chat-timestamp"
        )}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
          {message.isStreaming && (
            <span className="ml-2 inline-flex items-center">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;