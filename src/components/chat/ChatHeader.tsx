import { MessageCircle, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  agentName: string;
  isOnline?: boolean;
}

export default function ChatHeader({ agentName, isOnline = true }: ChatHeaderProps) {
  return (
    <div className="bg-gradient-primary text-primary-foreground p-4 shadow-medium">
      <div className="flex items-center space-x-3 max-w-4xl mx-auto">
        <div className="relative">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Bot className="w-5 h-5" />
          </div>
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
          )}
        </div>
        
        <div className="flex-1">
          <h1 className="font-semibold text-lg">Customer Support</h1>
          <div className="flex items-center space-x-2 text-sm opacity-90">
            <span>{agentName}</span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isOnline ? "bg-green-400" : "bg-gray-400"
              )}></div>
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>
        
        <MessageCircle className="w-6 h-6 opacity-80" />
      </div>
    </div>
  );
}