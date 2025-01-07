# Social Media Post Generator

An AI-powered social media management tool that helps create, refine, and adapt content for multiple social media platforms using Gemini AI.

## Features

### Content Generation & Refinement
- 🤖 AI-powered post generation using Gemini
- 💬 Interactive content refinement through chat interface
- ✨ Professional formatting with bold, italics, and emojis
- 🏷️ Automatic hashtag suggestions

### Multi-Platform Support
- 💼 LinkedIn (3000 chars)
- 🐦 X/Twitter (280 chars)
- 👥 Facebook (63206 chars)
- 🧵 Threads (500 chars)
- 📢 Truth Social (500 chars)
- ✅ BlueTick (280 chars)

### Smart Content Adaptation
- 📏 Automatic length adjustment per platform
- 🎯 Platform-specific tone and style
- 🔄 Real-time content preview
- 📊 Character count tracking

## Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│    Frontend     │     │   Backend    │     │    Gemini AI    │
│    (React)      │◄───►│   (FastAPI)  │◄───►│     Service     │
└─────────────────┘     └──────────────┘     └─────────────────┘
       ▲
       │
       ▼
┌─────────────────┐
│  Social Media   │
│   Platforms     │
└─────────────────┘
```

### Components
- **Frontend**: React + TypeScript + Vite
  - PostEditor: Main content creation interface
  - GeminiChat: Interactive AI refinement
  - PlatformSelector: Platform targeting
  - PlatformVariations: Platform-specific previews

- **Backend**: FastAPI
  - Content formatting endpoints
  - Platform-specific adapters
  - Gemini AI integration
  - Character limit handling

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python (3.11+)
- Gemini API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/SocialMediaPostApp.git
cd SocialMediaPostApp
```

2. Setup Frontend
```bash
cd frontend
npm install
```

3. Setup Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. Environment Configuration
```bash
# Frontend (.env)
VITE_GEMINI_API_KEY=your_gemini_api_key

# Backend (.env)
GEMINI_API_KEY=your_gemini_api_key
```

### Running the Application

1. Start Backend
```bash
cd backend
uvicorn main:app --reload
```

2. Start Frontend
```bash
cd frontend
npm run dev
```

## Building Upon This Project

### Adding New Platforms
1. Update `PlatformSelector.tsx` with new platform details
2. Add platform-specific formatting in backend
3. Implement character limit handling

### Enhancing AI Capabilities
1. Modify Gemini prompts in `main.py`
2. Add new conversation features in `GeminiChat.tsx`
3. Implement additional content refinement options

### Adding Authentication
1. Implement OAuth flow for social platforms
2. Add secure token storage
3. Create post scheduling functionality

## License

This project is licensed under a custom royalty license - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.
