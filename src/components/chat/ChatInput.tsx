import { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function ChatInput({ onSendMessage, disabled = false, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim() && !disabled && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 bg-card border-t border-border">
      <div className="flex items-end space-x-3 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            disabled={disabled || isLoading}
            className={cn(
              "min-h-[44px] max-h-32 resize-none rounded-xl border-2 transition-all duration-200",
              "focus:border-primary focus:ring-1 focus:ring-primary/20",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            rows={1}
          />
        </div>
        
        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || disabled || isLoading}
          size="icon"
          className={cn(
            "h-11 w-11 rounded-xl bg-gradient-primary hover:shadow-medium transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}