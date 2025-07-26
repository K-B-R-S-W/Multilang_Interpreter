import { useState, useEffect, useRef } from 'react';
import { TextInput, Button, Paper, ScrollArea } from '@mantine/core';

interface Message {
  original: string;
  translated: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  targetLanguage: string;
}

const ChatInterface = ({ targetLanguage }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8000/ws');
    
    websocket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, {
        original: data.original_text,
        translated: data.translated_text,
        isUser: true,
        timestamp: new Date()
      }]);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !ws) return;

    ws.send(JSON.stringify({
      text: inputText,
      target_language: targetLanguage
    }));

    setInputText('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col space-y-4">
      <ScrollArea h={500} ref={scrollRef} className="rounded-xl bg-gray-50 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <Paper
                shadow="sm"
                p="md"
                className={`max-w-[70%] ${
                  message.isUser
                    ? 'bg-blue-600 text-white rounded-2xl rounded-br-none'
                    : 'bg-white rounded-2xl rounded-bl-none'
                }`}
              >
                <div className={`text-sm ${message.isUser ? 'text-blue-100' : 'text-gray-600'}`}>
                  {message.original}
                </div>
                <div className="text-base mt-1">{message.translated}</div>
                <div className={`text-xs mt-2 text-right ${
                  message.isUser ? 'text-blue-200' : 'text-gray-400'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </Paper>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex space-x-2">
        <TextInput
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1"
          size="lg"
          styles={{
            input: {
              borderRadius: '1.5rem',
              backgroundColor: 'white',
              border: '2px solid #e2e8f0',
              '&:focus': {
                borderColor: '#3b82f6'
              }
            }
          }}
        />
        <Button
          onClick={handleSendMessage}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 rounded-full px-8"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface; 