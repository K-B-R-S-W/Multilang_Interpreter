# 🌍 Multilingual Translation Chatbot

> A modern, real-time translation chatbot with voice integration and beautiful UI

---

## ✨ Features

### 🚀 Core Capabilities
- **Real-time Translation** - Instant text translation with WebSocket support
- **Voice Integration** - Text-to-speech generation using Google TTS
- **Modern UI** - Responsive design with Mantine components
- **Beautiful Design** - Gradient backgrounds and glassmorphism effects
- **Auto-Reconnection** - Robust WebSocket connection handling

### 🌐 Language Support
Our chatbot supports **12 languages** for seamless global communication:

| Language | Code | Language | Code |
|----------|------|----------|------|
| 🇺🇸 English | `en` | 🇳🇱 Dutch | `nl` |
| 🇪🇸 Spanish | `es` | 🇵🇱 Polish | `pl` |
| 🇫🇷 French | `fr` | 🇷🇺 Russian | `ru` |
| 🇩🇪 German | `de` | 🇯🇵 Japanese | `ja` |
| 🇮🇹 Italian | `it` | 🇰🇷 Korean | `ko` |
| 🇵🇹 Portuguese | `pt` | 🇨🇳 Chinese | `zh` |

### 💫 User Experience
- **Real-time Chat** - Live messaging with history
- **Audio Playback** - Listen to translated messages
- **Smooth Animations** - Fluid transitions and effects
- **Mobile Ready** - Fully responsive across all devices
- **Custom Styling** - Elegant scrollbars and components

---

## 🛠️ Tech Stack

### Frontend Technologies
```
⚛️  React 18 + TypeScript
⚡  Vite 7 (Lightning-fast development)
🎨  Mantine UI Components
🌊  TailwindCSS for styling
🔌  WebSocket real-time communication
🎵  Web Audio API integration
```

### Backend Technologies
```
🚀  FastAPI (Modern Python web framework)
🐍  Python 3.8+ runtime
🗣️  gTTS (Google Text-to-Speech)
🤖  Groq API integration
🔄  WebSocket server
🌐  CORS support
```

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- ✅ **Python** (v3.8 or higher) - [Download here](https://python.org/)
- ✅ **Groq API Key** - [Get yours here](https://groq.com/)

### 📦 Installation

#### 1️⃣ Clone the Repository
```bash
git clone
cd multilingual-translation-chatbot
```

#### 2️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
> 🌐 Frontend will be available at `http://localhost:5174`

#### 3️⃣ Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```
> 🚀 Backend API will be available at `http://localhost:8000`

#### 4️⃣ Environment Configuration
Create a `.env` file in the backend directory:
```bash
```

Add your configuration:
```env
GROQ_API_KEY=your_groq_api_key_here
```

---

## 🔧 Development

### 🌐 Service Endpoints
| Service | URL | Description |
|---------|-----|-------------|
| Frontend | `http://localhost:5174` | React development server |
| Backend API | `http://localhost:8000` | FastAPI REST endpoints |
| WebSocket | `ws://localhost:8000/ws` | Real-time communication |
| API Docs | `http://localhost:8000/docs` | Interactive API documentation |

### 🔍 Environment Variables

#### Backend Configuration
```env
# Required
GROQ_API_KEY=your_groq_api_key_here

# Optional
PORT=8000
HOST=localhost
DEBUG=true
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for AI capabilities
- [Google TTS](https://gtts.readthedocs.io/) for voice synthesis
- [Mantine](https://mantine.dev/) for beautiful UI components
- [FastAPI](https://fastapi.tiangolo.com/) for the robust backend framework

---

<div align="center">

---

## 📮 Support

- **📧 Email:** [k.b.ravindusankalpaac@gmail.com](mailto:k.b.ravindusankalpaac@gmail.com)  
- **🐞 Bug Reports:** [GitHub Issues](https://github.com/K-B-R-S-W/Multilang_Interpreter/issues)  
- **📚 Documentation:** See the project [Wiki](https://github.com/K-B-R-S-W/Multilang_Interpreter/wiki)  
- **💭 Discussions:** Join the [GitHub Discussions](https://github.com/K-B-R-S-W/Multilang_Interpreter/discussions)

---

## ⭐ Support This Project

If you find this project helpful, please consider giving it a **⭐ star** on GitHub!

</div>
