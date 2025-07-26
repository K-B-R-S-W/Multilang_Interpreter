import { useState } from 'react';
import { Button, Transition } from '@mantine/core';

interface VoiceInputProps {
  targetLanguage: string;
  onTranscription: (text: string) => void;
}

const VoiceInput = ({ targetLanguage, onTranscription }: VoiceInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob);

        try {
          const response = await fetch(`http://localhost:8000/speech-to-text?language_code=${targetLanguage}`, {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();
          if (data.text) {
            onTranscription(data.text);
          }
        } catch (error) {
          console.error('Error transcribing audio:', error);
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        setRecordingDuration(0);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      // Start duration counter
      const startTime = Date.now();
      const durationInterval = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      // Store interval ID in recorder to clear it later
      (recorder as any).durationInterval = durationInterval;

    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      clearInterval((mediaRecorder as any).durationInterval);
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <Button
        color={isRecording ? 'red' : 'blue'}
        onClick={isRecording ? stopRecording : startRecording}
        size="lg"
        className={`rounded-full w-48 transition-all duration-300 ${
          isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        leftIcon={
          <div className={`w-3 h-3 rounded-full ${
            isRecording ? 'bg-red-200' : 'bg-blue-200'
          }`} />
        }
      >
        {isRecording ? 'Stop Recording' : 'Start Voice Input'}
      </Button>
      
      <Transition
        mounted={isRecording}
        transition="fade"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <div
            style={styles}
            className="text-sm text-gray-600 font-medium"
          >
            Recording... {formatDuration(recordingDuration)}
          </div>
        )}
      </Transition>
    </div>
  );
};

export default VoiceInput; 