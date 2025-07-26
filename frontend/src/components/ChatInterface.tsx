import { useState, useEffect, useRef } from 'react';
import { TextInput, Button, Paper, ScrollArea } from '@mantine/core';

interface Message {
  original: string;
  translated: string;
  isUser: boolean;
  timestamp: Date;
  audioData?: ArrayBuffer;
}

interface ChatInterfaceProps {
  targetLanguage: string;
}

const ChatInterface = ({ targetLanguage }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;
    const connectWebSocket = () => {
      const websocket = new WebSocket('ws://localhost:8000/ws');
      
      websocket.onopen = () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);
      };

      websocket.onclose = (event) => {
        console.log('Disconnected from WebSocket:', event.code, event.reason);
        setIsConnected(false);
        // Only attempt to reconnect if the connection was lost unexpectedly
        if (event.code !== 1000) {
          console.log('Attempting to reconnect...');
          reconnectTimeout = setTimeout(connectWebSocket, 2000);
        }
      };

      websocket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      let audioBuffer: ArrayBuffer | undefined;

      if (data.audio_bytes) {
        try {
          // Convert hex string to ArrayBuffer
          const audioBytes = new Uint8Array(
            data.audio_bytes.match(/.{1,2}/g).map((byte: string) => parseInt(byte, 16))
          );
          audioBuffer = audioBytes.buffer;

          // Play the audio
          if (!audioContext.current) {
            audioContext.current = new AudioContext();
          }
          const audioSource = audioContext.current.createBufferSource();
          if (audioBuffer) {
            const decodedData = await audioContext.current.decodeAudioData(audioBuffer);
            audioSource.buffer = decodedData;
            audioSource.connect(audioContext.current.destination);
            audioSource.start();
          }
        } catch (error) {
          console.error('Error processing audio:', error);
        }
      }

      setMessages(prev => [...prev, {
        original: data.original_text,
        translated: data.translated_text,
        isUser: false, // Fixed: Messages from server are not user messages
        timestamp: new Date(),
        audioData: audioBuffer
      }]);
    };

    websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        // Close the connection to trigger reconnect
        websocket.close();
      };



    setWs(websocket);
      return websocket;
    };

    const ws = connectWebSocket();

    const handleBeforeUnload = () => {
      if (ws) {
        ws.close(1000, 'Page closed');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearTimeout(reconnectTimeout);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (ws) {
        ws.close(1000, 'Component unmounted');
      }
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !ws || !isConnected) return;

    // Add user message immediately
    setMessages(prev => [...prev, {
      original: inputText,
      translated: '', // Will be filled by server response
      isUser: true,
      timestamp: new Date()
    }]);

    ws.send(JSON.stringify({
      text: inputText,
      target_language: targetLanguage
    }));

    setInputText('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const playAudio = async (audioData: ArrayBuffer) => {
    try {
      if (!audioContext.current) {
        audioContext.current = new AudioContext();
      }
      const audioSource = audioContext.current.createBufferSource();
      const decodedData = await audioContext.current.decodeAudioData(audioData);
      audioSource.buffer = decodedData;
      audioSource.connect(audioContext.current.destination);
      audioSource.start();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
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
                {message.translated && (
                  <div className="text-base mt-1">{message.translated}</div>
                )}
                {message.audioData && (
                  <Button
                    variant="subtle"
                    size="xs"
                    onClick={() => message.audioData && playAudio(message.audioData)}
                    className="mt-2 text-blue-200 hover:text-blue-300"
                  >
                    Play Audio
                  </Button>
                )}
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
          disabled={!isConnected}
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
          disabled={!isConnected}
          className="bg-blue-600 hover:bg-blue-700 rounded-full px-8 disabled:opacity-50"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;