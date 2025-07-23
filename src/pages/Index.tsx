import CustomerSupportChat from '@/components/chat/CustomerSupportChat';
import { ChatConfig } from '@/components/chat/types';

const Index = () => {
  const chatConfig: ChatConfig = {
    userId: 'imagine-gitbook-docs',
    conversationId: 'customer-support-bot',
    agentName: 'Alex',
    apiEndpoint: 'http://0.0.0.0:8081/chat',
    authToken: 'token2',
  };

  return (
    <div className="h-screen">
      <CustomerSupportChat config={chatConfig} />
    </div>
  );
};

export default Index;
