from fastapi import FastAPI, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import tempfile
import os
from langchain_utils import speech_to_text, text_to_speech

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranslationRequest(BaseModel):
    text: str
    target_language: str
    source_language: Optional[str] = None

@app.get("/languages")
async def get_languages():
    """Get list of available languages for translation"""
    languages = [
        {"language": "en", "name": "English"},
        {"language": "es", "name": "Spanish"},
        {"language": "fr", "name": "French"},
        {"language": "de", "name": "German"},
        {"language": "it", "name": "Italian"},
        {"language": "pt", "name": "Portuguese"},
        {"language": "nl", "name": "Dutch"},
        {"language": "pl", "name": "Polish"},
        {"language": "ru", "name": "Russian"},
        {"language": "ja", "name": "Japanese"},
        {"language": "ko", "name": "Korean"},
        {"language": "zh", "name": "Chinese"}
    ]
    return {"languages": languages}

@app.post("/speech-to-text")
async def convert_speech_to_text(audio: UploadFile, language_code: str):
    """Convert speech to text"""
    try:
        # Create a temporary file to store the audio
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
            content = await audio.read()
            temp_audio.write(content)
            temp_path = temp_audio.name

        try:
            # Convert speech to text
            text = speech_to_text(content, temp_path)
            return {"text": text}
        finally:
            # Clean up the temporary file
            os.unlink(temp_path)
    except Exception as e:
        return {"error": str(e)}

# WebSocket for real-time chat
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Log received message for debugging
            print(f"Received message: {message}")
            
            # Generate speech from text in target language
            text = message.get("text", "")
            target_language = message.get("target_language", "en")
            
            # Generate speech from text in target language
            audio_bytes = text_to_speech(text, target_language)
            
            # Send back the audio and original text
            try:
                await websocket.send_json({
                    "original_text": text,
                    "translated_text": text,  # For now, just echo back the original text
                    "audio_bytes": audio_bytes.hex() if audio_bytes else None
                })
            except Exception as e:
                print(f"Error sending WebSocket response: {e}")
                break
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)