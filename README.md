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
-�� Bluesky (300 chars)

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

# Social Media Post Generator

## Executive Summary
A cloud-native application that leverages Google's Gemini AI to generate and format social media posts. The application supports multiple platforms, handles character limits automatically, and provides platform-specific formatting while maintaining a serverless architecture on AWS.

## User Stories
### Core Functionality
```
As a social media manager
I want to generate platform-optimized content from a single input
So that I can efficiently create consistent posts across multiple platforms
```

### Acceptance Criteria
1. User can input desired post content
2. System generates AI-enhanced content
3. Content is automatically formatted for selected platforms
4. Character limits are respected for each platform
5. CORS enables cross-origin requests
6. API responses are properly formatted JSON
7. Error handling provides clear feedback

### Definition of Done
- ✅ All acceptance criteria met
- ✅ Code deployed to AWS successfully
- ✅ API endpoints respond within 3 seconds
- ✅ Frontend successfully communicates with backend
- ✅ CORS headers properly configured
- ✅ Error messages are user-friendly
- ✅ CloudWatch logs show successful request handling

## Design
### High-Level Architecture
```
Frontend (React/Vite) → CloudFront → S3
                     ↓
API Gateway → Lambda → DynamoDB
                     ↓
              Google Gemini AI
```

### Low-Level Design
#### Frontend Stack
- React 18 with TypeScript
- Vite for build tooling
- Material-UI for components
- Zustand for state management

#### Backend Stack
- FastAPI for API framework
- Mangum for Lambda/FastAPI integration
- Google Generative AI for content generation
- AWS CDK for infrastructure as code

#### Key Dependencies
1. **FastAPI**
   - Handles HTTP requests
   - Provides OpenAPI documentation
   - Manages request/response lifecycle

2. **Mangum**
   - Adapts FastAPI to AWS Lambda
   - Converts Lambda events to ASGI
   - Manages response formatting

3. **Google Generative AI**
   - Provides AI content generation
   - Handles prompt engineering
   - Manages API communication

4. **AWS CDK**
   - Defines infrastructure as code
   - Manages AWS resource creation
   - Handles deployment automation

## Frequently Asked Questions

1. **Q: How do I get started?**
   A: Clone the repository, install dependencies, and run `cdk deploy` to deploy to AWS.

2. **Q: What are the prerequisites?**
   A: AWS account, Google Gemini API key, Node.js, Python 3.12+

3. **Q: How do I update the Lambda function?**
   A: Modify code, zip the backend folder, and run `cdk deploy`

4. **Q: Where do I find API documentation?**
   A: After deployment, visit the API Gateway console for endpoint details

5. **Q: How do I monitor usage?**
   A: Check CloudWatch logs and DynamoDB usage table

6. **Q: Can I customize character limits?**
   A: Yes, modify the platform limits in the backend code

7. **Q: How do I handle CORS issues?**
   A: Update allowed origins in CDK stack and API Gateway settings

8. **Q: What's the cost structure?**
   A: Costs based on AWS Lambda usage and Gemini API calls

9. **Q: How do I add new platforms?**
   A: Add platform config in backend and update frontend platform list

10. **Q: Is there a rate limit?**
    A: Configurable via environment variables (DAILY_REQUEST_LIMIT)

11. **Q: How secure is the application?**
    A: Uses AWS IAM roles and API Gateway for security

12. **Q: Can I use a different AI model?**
    A: Yes, modify the AI integration in the backend code

## Setup Instructions
1. Clone repository
2. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   ```bash
   # Frontend
   VITE_API_URL=your_api_url
   VITE_GEMINI_API_KEY=your_api_key

   # Backend
   GEMINI_API_KEY=your_api_key
   ```

4. Deploy:
   ```bash
   cd social-media-app-cdk
   cdk deploy
   ```

## Development Workflow
1. Make code changes
2. Test locally
3. Create deployment package:
   ```bash
   cd backend
   zip -r ../social-media-app-cdk/lambda_function.zip .
   ```
4. Deploy:
   ```bash
   cd ../social-media-app-cdk
   cdk deploy
   ```

## Troubleshooting
- Check CloudWatch logs for Lambda errors
- Verify CORS settings in API Gateway
- Ensure environment variables are set
- Validate Lambda function timeout settings

## Contributing
1. Fork repository
2. Create feature branch
3. Submit pull request
4. Ensure tests pass

## License
MIT License
