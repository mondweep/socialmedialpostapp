from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from google.generativeai import GenerativeModel
import google.generativeai as genai
import logging
import time

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("Starting server...")
api_key = os.getenv('GEMINI_API_KEY')
logger.info(f"Gemini API key loaded: {'Yes' if api_key else 'No'}")

# Initialize Gemini only if key exists
if api_key:
    genai.configure(api_key=api_key)
    model = GenerativeModel('gemini-pro')
    logger.info("Gemini model initialized successfully")
else:
    logger.error("No Gemini API key found!")

# Models
class PostRequest(BaseModel):
    content: str
    platforms: List[str]
    variations: Optional[dict[str, str]] = None

class PostResponse(BaseModel):
    success: bool
    posts: dict[str, str]
    errors: Optional[dict[str, str]] = None

class TwitterFormat(BaseModel):
    content: str
    formatted_content: str
    char_count: int

class BluetickFormat(BaseModel):
    content: str
    formatted_content: str
    char_count: int

class BlueskyFormat(BaseModel):
    content: str
    formatted_content: str
    char_count: int

class TruthSocialFormat(BaseModel):
    content: str
    formatted_content: str
    char_count: int

# Routes
@app.get("/")
async def read_root():
    return {"status": "ok", "message": "Social Media Post API"}

@app.post("/api/post", response_model=PostResponse)
async def create_posts(request: PostRequest):
    try:
        # TODO: Implement actual posting logic
        return PostResponse(
            success=True,
            posts={platform: request.content for platform in request.platforms}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/platforms")
async def get_platforms():
    return {
        "platforms": [
            {"id": "linkedin", "name": "LinkedIn", "characterLimit": 3000},
            {"id": "facebook", "name": "Facebook", "characterLimit": 63206},
            {"id": "x", "name": "X", "characterLimit": 280},
            {"id": "threads", "name": "Threads", "characterLimit": 500},
            {"id": "truth", "name": "Truth Social", "characterLimit": 500},
            {"id": "bluetick", "name": "BlueTick", "characterLimit": 280}
        ]
    }

@app.post("/api/format/{platform}")
async def format_for_platform(platform: str, request: dict):
    try:
        content = request.get('content', '')
        platform_limits = {
            'twitter': 280,
            'x': 280,
            'linkedin': 3000,
            'facebook': 63206,
            'bluesky': 300,
            'truth': 500
        }
        
        limit = platform_limits.get(platform.lower(), 280)
        
        if len(content) > limit:
            prompt = f"""
            Format this text for {platform} in {limit} characters or less.
            Add appropriate formatting:
            - Use ** for bold text
            - Use _ for italics
            - Add relevant emojis
            - Add appropriate hashtags
            - Maintain professional tone
            - Break into readable paragraphs
            
            Original content:
            {content}
            """
            
            response = model.generate_content(prompt)
            formatted_content = response.text.strip()
        else:
            formatted_content = content
            
        return {
            "content": content,
            "formatted_content": formatted_content,
            "char_count": len(formatted_content)
        }
    except Exception as e:
        logger.error(f"Error formatting for {platform}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/format/bluetick", response_model=BluetickFormat)
async def format_for_bluetick(content: str):
    try:
        # BlueTick's character limit
        BLUETICK_LIMIT = 280
        
        formatted_content = content
        if len(content) > BLUETICK_LIMIT:
            formatted_content = content[:BLUETICK_LIMIT - 3] + "..."
            
        return BluetickFormat(
            content=content,
            formatted_content=formatted_content,
            char_count=len(formatted_content)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/format/bluesky")
async def format_for_bluesky(request: dict):
    try:
        content = request.get('content', '')
        BLUESKY_LIMIT = 300
        
        if len(content) > BLUESKY_LIMIT:
            logger.info("Content exceeds Bluesky limit, calling Gemini...")
            prompt = f"""
            Summarize this text in {BLUESKY_LIMIT} characters or less while maintaining the key message:
            {content}
            Make it engaging for Bluesky users.
            """
            response = model.generate_content(prompt)
            formatted_content = response.text.strip()
        else:
            formatted_content = content
            
        return {
            "content": content,
            "formatted_content": formatted_content,
            "char_count": len(formatted_content)
        }
    except Exception as e:
        logger.error(f"Error in format_for_bluesky: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/format/truthsocial")
async def format_for_truthsocial(request: dict):
    try:
        content = request.get('content', '')
        TRUTH_SOCIAL_LIMIT = 500
        
        if len(content) > TRUTH_SOCIAL_LIMIT:
            logger.info("Content exceeds Truth Social limit, calling Gemini...")
            prompt = f"""
            Summarize this text in {TRUTH_SOCIAL_LIMIT} characters or less while maintaining the key message:
            {content}
            Make it engaging for Truth Social users.
            """
            response = model.generate_content(prompt)
            formatted_content = response.text.strip()
        else:
            formatted_content = content
            
        return {
            "content": content,
            "formatted_content": formatted_content,
            "char_count": len(formatted_content)
        }
    except Exception as e:
        logger.error(f"Error in format_for_truthsocial: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/format/linkedin")
async def format_for_linkedin(request: dict):
    try:
        content = request.get('content', '')
        LINKEDIN_LIMIT = 3000
        
        if len(content) > LINKEDIN_LIMIT:
            logger.info("Content exceeds LinkedIn limit, calling Gemini...")
            prompt = f"""
            Format this text professionally for LinkedIn in {LINKEDIN_LIMIT} characters or less:
            {content}
            Add relevant hashtags and maintain a business-appropriate tone.
            """
            response = model.generate_content(prompt)
            formatted_content = response.text.strip()
        else:
            formatted_content = content
            
        return {
            "content": content,
            "formatted_content": formatted_content,
            "char_count": len(formatted_content)
        }
    except Exception as e:
        logger.error(f"Error in format_for_linkedin: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
