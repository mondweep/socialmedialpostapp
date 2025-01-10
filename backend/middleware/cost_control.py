from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from datetime import datetime, date
import json
from pathlib import Path
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get configuration from environment variables
ENABLE_DAILY_LIMIT = os.getenv('ENABLE_DAILY_LIMIT', 'false').lower() == 'true'
DAILY_REQUEST_LIMIT = int(os.getenv('DAILY_REQUEST_LIMIT', 100))

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

USAGE_FILE = Path("data/usage.json")

async def cost_control_middleware(request: Request, call_next):
    today = date.today().isoformat()
    
    logger.debug(f"Processing request for date: {today}")
    
    if ENABLE_DAILY_LIMIT:
        # Initialize or load usage data
        if not USAGE_FILE.exists():
            logger.debug("Usage file not found, creating new one")
            USAGE_FILE.parent.mkdir(exist_ok=True)
            USAGE_FILE.write_text(json.dumps({}))
        
        usage_data = json.loads(USAGE_FILE.read_text())
        logger.debug(f"Current usage data: {usage_data}")
        
        # Get or create today's usage
        if today not in usage_data:
            logger.debug(f"Initializing count for {today}")
            usage_data[today] = {"request_count": 0, "last_updated": datetime.now().isoformat()}
        
        logger.debug(f"Request count before increment: {usage_data[today]['request_count']}")
        
        # Check if we've exceeded daily limit
        if usage_data[today]["request_count"] >= DAILY_REQUEST_LIMIT:
            logger.warning(f"Daily limit exceeded: {usage_data[today]['request_count']} >= {DAILY_REQUEST_LIMIT}")
            return JSONResponse(
                status_code=429,
                content={"detail": "Daily usage limit exceeded. Service will resume tomorrow."},
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Headers": "*",
                }
            )
        
        # Increment request count
        usage_data[today]["request_count"] += 1
        usage_data[today]["last_updated"] = datetime.now().isoformat()
        
        logger.debug(f"Request count after increment: {usage_data[today]['request_count']}")
        
        # Save updated usage
        USAGE_FILE.write_text(json.dumps(usage_data, indent=2))
    
    # Continue with the request
    response = await call_next(request)
    return response