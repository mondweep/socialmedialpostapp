from mangum import Mangum
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

# Import your existing FastAPI app from main.py
from main import app

# Create the handler
handler = Mangum(app)
