from io import BytesIO
import logging
import os
from gtts import gTTS
from groq import Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Groq client with API key from environment
groq_api_key = os.getenv('GROQ_API_KEY')
if not groq_api_key:
    raise ValueError("GROQ_API_KEY environment variable is not set")

groq_client = Client(api_key=groq_api_key)

def speech_to_text(file_content, temp_path):
    """Transcribes audio file using Groq Whisper API."""
    logger.info("Starting audio transcription...")
    try:
        with open(temp_path, "rb") as audio_file_to_transcribe:
            transcription_response = groq_client.audio.transcriptions.create(
                file=(temp_path, audio_file_to_transcribe.read()),
                model="whisper-large-v3",
                response_format="text"
            )
        transcription = transcription_response
        logger.info(f"Transcription successful: '{transcription}'")
        if not transcription or transcription.strip() == "":
            logger.warning("Transcription resulted in empty text.")
            return "I didn't catch that. Could you please speak clearly?"
        return transcription
    except Exception as e:
        logger.error(f"Error during transcription: {e}", exc_info=True)
        raise

def text_to_speech(text: str, lang: str = 'en'):
    """Converts text to speech using gTTS and returns audio bytes."""
    logger.info(f"Generating TTS audio for: '{text}'")
    try:
        tts = gTTS(text=text, lang=lang, slow=False)
        audio_buffer = BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        logger.info("TTS audio generated successfully.")
        return audio_buffer.read()
    except Exception as e:
        logger.error(f"Error during TTS generation: {e}", exc_info=True)
        raise