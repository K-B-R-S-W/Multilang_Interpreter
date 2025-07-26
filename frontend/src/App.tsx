import { useState, useEffect } from 'react';
import { MantineProvider, Container, Paper } from '@mantine/core';
import ChatInterface from './components/ChatInterface';
import LanguageSelector from './components/LanguageSelector';
import VoiceInput from './components/VoiceInput';

interface Language {
  language: string;
  name: string;
}

function App() {
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    // Fetch available languages from the backend
    fetch('http://localhost:8000/languages')
      .then(response => response.json())
      .then(data => setLanguages(data.languages))
      .catch(error => console.error('Error fetching languages:', error));
  }, []);

  const handleTranscription = (text: string) => {
    console.log('Transcribed text:', text);
  };

  return (
    <MantineProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
        <Container size="lg">
          <Paper
            shadow="sm"
            p="xl"
            className="rounded-2xl bg-white/80 backdrop-blur-sm"
          >
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Multilingual Translation Chat
                </h1>
                <p className="mt-2 text-gray-600">
                  Communicate across languages with real-time translation
                </p>
              </div>
              
              <div className="max-w-md mx-auto">
                <LanguageSelector
                  languages={languages}
                  selectedLanguage={targetLanguage}
                  onLanguageChange={setTargetLanguage}
                />
              </div>
              
              <ChatInterface targetLanguage={targetLanguage} />
              
              <div className="flex justify-center">
                <VoiceInput
                  targetLanguage={targetLanguage}
                  onTranscription={handleTranscription}
                />
              </div>
            </div>
          </Paper>
        </Container>
      </div>
    </MantineProvider>
  );
}

export default App;
