import { useState } from 'react';
import CustomerSupportChat from '@/components/chat/CustomerSupportChat';
import ChatConfigForm from '@/components/chat/ChatConfigForm';
import { ChatConfig } from '@/components/chat/types';

const Index = () => {
  const [chatConfig, setChatConfig] = useState<ChatConfig | null>(null);

  const handleConfigSubmit = (config: ChatConfig) => {
    setChatConfig(config);
  };

  const handleResetConfig = () => {
    setChatConfig(null);
  };

  if (!chatConfig) {
    return <ChatConfigForm onConfigSubmit={handleConfigSubmit} />;
  }

  return (
    <div className="h-screen">
      <CustomerSupportChat config={chatConfig} />
    </div>
  );
};

export default Index;
