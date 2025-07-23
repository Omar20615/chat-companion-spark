import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatConfig } from './types';
import { Settings, MessageCircle } from 'lucide-react';

interface ChatConfigFormProps {
  onConfigSubmit: (config: ChatConfig) => void;
}

export default function ChatConfigForm({ onConfigSubmit }: ChatConfigFormProps) {
  const [config, setConfig] = useState<Partial<ChatConfig>>({
    userId: 'imagine-gitbook-docs',
    conversationId: 'customer-support-bot',
    agentName: 'Alex',
    apiEndpoint: 'http://0.0.0.0:8081/chat',
    authToken: 'token2',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onConfigSubmit(config as ChatConfig);
    }
  };

  const isFormValid = () => {
    return config.userId && 
           config.conversationId && 
           config.agentName && 
           config.apiEndpoint && 
           config.authToken;
  };

  const updateConfig = (key: keyof ChatConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Customer Support Bot</h1>
          <p className="text-muted-foreground">Configure your chat settings to get started</p>
        </div>

        <Card className="shadow-strong border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Settings className="w-4 h-4 text-primary" />
            </div>
            <CardTitle>Chat Configuration</CardTitle>
            <CardDescription>
              Enter your API details to connect to the chat service
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiEndpoint">API Endpoint</Label>
                <Input
                  id="apiEndpoint"
                  type="url"
                  placeholder="http://0.0.0.0:8081/chat"
                  value={config.apiEndpoint || ''}
                  onChange={(e) => updateConfig('apiEndpoint', e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authToken">Authorization Token</Label>
                <Input
                  id="authToken"
                  type="text"
                  placeholder="token2"
                  value={config.authToken || ''}
                  onChange={(e) => updateConfig('authToken', e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    placeholder="imagine-gitbook-docs"
                    value={config.userId || ''}
                    onChange={(e) => updateConfig('userId', e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agentName">Agent Name</Label>
                  <Input
                    id="agentName"
                    placeholder="Alex"
                    value={config.agentName || ''}
                    onChange={(e) => updateConfig('agentName', e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conversationId">Conversation ID</Label>
                <Input
                  id="conversationId"
                  placeholder="customer-support-bot"
                  value={config.conversationId || ''}
                  onChange={(e) => updateConfig('conversationId', e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <Button
                type="submit"
                disabled={!isFormValid()}
                className="w-full bg-gradient-primary hover:shadow-medium transition-all duration-200 disabled:opacity-50"
              >
                Start Chat
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-muted-foreground">
          <p>Chat history is maintained until page refresh</p>
        </div>
      </div>
    </div>
  );
}