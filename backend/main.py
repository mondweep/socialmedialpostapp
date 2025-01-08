from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from google.generativeai import GenerativeModel
import google.generativeai as genai
import logging
import time
import re
from models.feedback import Feedback
import json
from pathlib import Path
from config.config import settings
from middleware.cost_control import cost_control_middleware
from datetime import date

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI()

# Add cost control middleware
app.middleware("http")(cost_control_middleware)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
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

# Get DAILY_REQUEST_LIMIT from environment variable, with a default fallback of 100
DAILY_REQUEST_LIMIT = int(os.getenv('DAILY_REQUEST_LIMIT', 100))

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

# Create data directories and files
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)
FEEDBACK_FILE = DATA_DIR / "feedback.json"
USAGE_FILE = DATA_DIR / "usage.json"

# Initialize files if they don't exist
if not FEEDBACK_FILE.exists():
    FEEDBACK_FILE.write_text("[]")
if not USAGE_FILE.exists():
    USAGE_FILE.write_text("{}")

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

@app.post("/api/format/x")
async def format_for_x(request: Request):
    try:
        data = await request.json()
        # Format content for X's character limit
        content = data.get("content", "")
        # Ensure content fits X's 280 character limit
        formatted_content = content[:280]
        return {"content": formatted_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/refine")
async def refine_content(request: dict):
    try:
        content = request.get('content', '')
        instruction = request.get('instruction', '')
        
        prompt = f"""
        Refine this content according to the following instruction:
        "{instruction}"

        Original content:
        {content}

        Please maintain this formatting structure:
        1. Single newline before new sections (marked by emojis or headers)
        2. Keep related content in the same paragraph
        3. Use bullet points or lists where appropriate
        4. Add a newline before lists
        5. Add a newline before hashtags
        6. Remove any excessive line breaks

        The content should flow naturally within sections while maintaining clear
        section breaks for readability.
        """
        
        response = model.generate_content(prompt)
        refined_content = response.text.strip()
        
        # Replace multiple newlines with double newlines
        refined_content = re.sub(r'\n{3,}', '\n\n', refined_content)
        
        return {
            "refined_content": refined_content
        }
    except Exception as e:
        logger.error(f"Error refining content: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate")
async def generate_post(request: dict):
    try:
        content = request.get('content', '')
        
        prompt = f"""
        Create an engaging social media post based on this input:
        {content}

        Please format the response with these rules:
        1. Use a single newline before each new section (marked by emojis or headers)
        2. Keep related content in the same paragraph without extra newlines
        3. Use bullet points or numbered lists where appropriate
        4. Add a newline before lists or key points
        5. Add a newline before hashtags at the end
        6. Start key sections with relevant emojis

        Example format:
        🌟 **Main Title**
        This is the first paragraph that flows naturally. The related content continues
        in the same paragraph without breaks. This makes it easy to read while keeping
        the content cohesive.

        🔧 **Technical Details**
        - Point 1
        - Point 2
        - Point 3

        💡 **Key Benefits**
        Here's another paragraph with related content flowing naturally.
        
        #Hashtag1 #Hashtag2 #Hashtag3
        """
        
        response = model.generate_content(prompt)
        generated_content = response.text.strip()
        
        # Replace multiple newlines with double newlines
        generated_content = re.sub(r'\n{3,}', '\n\n', generated_content)
        
        return {
            "original_content": content,
            "generated_content": generated_content
        }
    except Exception as e:
        logger.error(f"Error generating post: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/feedback")
async def save_feedback(feedback: Feedback, request: Request):
    try:
        logger.debug(f"Received raw feedback data: {feedback.dict()}")
        
        # Load existing feedback
        logger.debug(f"Reading from file: {FEEDBACK_FILE}")
        try:
            feedbacks = json.loads(FEEDBACK_FILE.read_text())
            logger.debug(f"Current feedbacks: {feedbacks}")
        except Exception as e:
            logger.error(f"Error reading feedback file: {e}")
            feedbacks = []
        
        # Add new feedback
        new_feedback = {
            "rating": feedback.rating,
            "comment": feedback.comment,
            "timestamp": feedback.timestamp
        }
        logger.debug(f"Preparing to add new feedback: {new_feedback}")
        
        feedbacks.append(new_feedback)
        
        # Save updated feedback
        try:
            FEEDBACK_FILE.write_text(json.dumps(feedbacks, indent=2))
            logger.debug("Successfully wrote to feedback file")
        except Exception as e:
            logger.error(f"Error writing to feedback file: {e}")
            raise
        
        return {"message": "Feedback saved successfully"}
    except Exception as e:
        logger.exception("Detailed error in save_feedback:")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/usage")
async def get_usage():
    if not USAGE_FILE.exists():
        return {"today_requests": 0, "limit": DAILY_REQUEST_LIMIT}
    
    usage_data = json.loads(USAGE_FILE.read_text())
    today = date.today().isoformat()
    
    return {
        "today_requests": usage_data.get(today, {}).get("request_count", 0),
        "limit": DAILY_REQUEST_LIMIT
    }
